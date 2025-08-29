CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    p_id INT;
BEGIN
    -- Determine the product_id based on the operation
    IF (TG_OP = 'DELETE') THEN
        p_id := OLD.product_id;
    ELSE
        p_id := NEW.product_id;
    END IF;

    -- Update the products table with the new average rating and count
    UPDATE products
    SET
        average_rating = (
            SELECT AVG(rating)
            FROM product_reviews
            WHERE product_id = p_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = p_id
        )
    WHERE id = p_id;

    -- Handle the case where all reviews are deleted for a product
    IF (SELECT COUNT(*) FROM product_reviews WHERE product_id = p_id) = 0 THEN
        UPDATE products
        SET average_rating = 0, rating_count = 0
        WHERE id = p_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER recalculate_rating
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

import { NextRequest, NextResponse } from 'next/server'
import Database from '@/lib/dbConnection'

const query = `
SELECT 
    o.order_id,
    o.cart_id,
    o.payment_status,
    o.order_status,
    o.cod,
    o.billing_same_as_shipping,
    o.shipping_address,
    o.billing_address,
    o.created_at,
    ci.variant_id,
    ci.quantity,
    ci.status AS cart_item_status,
    pv.name AS variant_name,
    pv.stock,
    pv.images,
    pv.price_without_discount,
    pv.discount,
    p.title AS product_title
FROM orders o
JOIN cart_items ci ON o.cart_id = ci.cart_id
JOIN product_variants pv ON ci.variant_id = pv.variant_id
JOIN products p ON p.product_id = pv.product_id
ORDER BY o.created_at DESC;
`

export type OrderItem = {
  variantId: string
  quantity: number
  status: string
  name: string
  stock: number
  images: string[]
  priceWithoutDiscount: number
  discount: number
  actualPrice: number
  productTitle: string
}

export type Order = {
  orderId: string
  cartId: string
  paymentStatus: string
  orderStatus: string
  cod: boolean
  billingSameAsShipping: boolean
  shippingAddress: string
  billingAddress: string
  createdAt: string
  items: OrderItem[]
}

export type OrderApiResponse = {
  success: boolean
  orders?: Order[]
  message?: string
  error?: string
}

export async function GET(req: NextRequest) {
  let client
  try {
    client = Database()
    console.log(`Connected successfully to PostgreSQL`)

    const result = await client.query(query)
    console.log('Query executed successfully:', result.rows)

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No orders found' },
        { status: 404 }
      )
    }

    // Transform result into an array of grouped orders
    const orders = transformOrders(result.rows)

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders', error: (error as Error).message },
      { status: 500 }
    )
  }
}

function transformOrders(rows: any[]): Order[] {
  const orderMap: Record<string, Order> = {}

  rows.forEach(r => {
    if (!orderMap[r.order_id]) {
      orderMap[r.order_id] = {
        orderId: r.order_id,
        cartId: r.cart_id,
        paymentStatus: r.payment_status,
        orderStatus: r.order_status,
        cod: r.cod,
        billingSameAsShipping: r.billing_same_as_shipping,
        shippingAddress: r.shipping_address,
        billingAddress: r.billing_address,
        createdAt: r.created_at,
        items: []
      }
    }

    orderMap[r.order_id].items.push({
      variantId: r.variant_id,
      quantity: r.quantity,
      status: r.cart_item_status,
      name: r.variant_name,
      stock: r.stock,
      images: r.images,
      priceWithoutDiscount: r.price_without_discount,
      discount: r.discount,
      actualPrice: r.price_without_discount - (r.price_without_discount * r.discount / 100),
      productTitle: r.product_title,
    })
  })

  return Object.values(orderMap)
}

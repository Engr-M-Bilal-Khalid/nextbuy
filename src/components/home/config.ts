export type Variant = {
  variantId: string;
  name: string;
  color: string;
  stock:number;
  images: string[];
  priceWithoutDiscount: string;
  discount: string;
};

export type Review = {
  id: number;
  name: string;
  rating: number;
  description: string;
  date: Date;
  images: string[];
};

export interface SpecificationItem {
  label: string;
  value: string;
}

export type Product = {
  productId: string;
  categoryId: string;
  categoryName: string,
  tag: string;
  title: string;
  description: string;
  brand: string;
  rating: string;
  variants: Variant[]; // Note: property name is 'varinats' as in your data
  reviews: Review[];
  specifications: SpecificationItem[],
  productDetailDescription: string[];
  warrantyDetails: string[],
  returnPloicyDetails: string[],
  isActive:Boolean,
};


// export const earbuds: Product[] = [
//   {
//     productId: "1",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Gravity earbuds",
//     description: "Product is amazing",
//     brand: "Zero",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         stock:200,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       },
//       {
//         variantId: "2",
//         name: "Blue",
//         color: "#60A5FA",
//         stock:300,
//         images: [
//           "/assets/earbuds/blueImg1.png",
//           "/assets/earbuds/blueImg2.png"
//         ],
//         priceWithoutDiscount: "200",
//         discount: "20"
//       },
//       {
//         variantId: "3",
//         name: "Red",
//         color: "#DC2626",
//         stock:400,
//         images: [
//           "/assets/earbuds/redImg1.png",
//           "/assets/earbuds/redImg2.png"
//         ],
//         priceWithoutDiscount: "800",
//         discount: "20"
//       },
//       {
//         variantId: "4",
//         name: "Light green",
//         color: "#22C55E",
//         stock:500,
//         images: [
//           "/assets/earbuds/greenImg1.png",
//           "/assets/earbuds/greenImg2.png"
//         ],
//         priceWithoutDiscount: "1000",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "8 grams" },
//       { label: "Battery Life", value: "Up to 8 hours playback" },
//       { label: "Charging Time", value: "Approx. 1.5 hours" },
//       { label: "Wireless Range", value: "10 meters" },
//       { label: "Bluetooth Version", value: "5.2" },
//       { label: "Water Resistance", value: "IPX5" },
//       { label: "Noise Cancellation", value: "Active Noise Cancellation" },
//     ],
//     productDetailDescription: [
//       "Experience high-fidelity sound with the Zero Gravity earbuds, designed for comfort and superior wireless performance. They feature Active Noise Cancellation, ergonomic design, and long-lasting battery life to keep you connected all day. Compatible with all Bluetooth-enabled devices.",
//       "The earbuds come with a compact charging case and touch controls for easy music and call management. Sweat and water-resistant, perfect for workouts and outdoor use.",
//     ],
//     warrantyDetails: [
//       "The Zero Gravity earbuds come with a 1-year limited manufacturer warranty. This covers any defects in material or workmanship under normal use.",
//       "For warranty service, please contact our customer support with proof of purchase.",
//     ],

//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Items must be returned in original packaging and unused condition.",
//       "To initiate a return, please contact customer service to receive a return authorization and instructions.",
//       "Refunds will be processed to the original payment method after the item is inspected.",
//     ],


//   },
//   {
//     productId: "2",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Audionic earbuds",
//     description: "Product is amazing",
//     brand: "Audionic",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Light green",
//         color: "amber-900",
//         stock:200,
//         images: [
//           "/assets/earbuds/greenImg1.png",
//           "/assets/earbuds/greenImg2.png"
//         ],
//         priceWithoutDiscount: "1000",
//         discount: "20"
//       },
//       {
//         variantId: "2",
//         name: "Red",
//         color: "#DC2626",
//         stock:300,
//         images: [
//           "/assets/earbuds/redImg1.png",
//           "/assets/earbuds/redImg2.png"
//         ],
//         priceWithoutDiscount: "800",
//         discount: "20"
//       },
//       {
//         variantId: "3",
//         name: "Black",
//         color: "#000000",
//         stock:400,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       },
//       {
//         variantId: "4",
//         name: "Blue",
//         color: "#60A5FA",
//         stock:1000,
//         images: [
//           "/assets/earbuds/blueImg1.png",
//           "/assets/earbuds/blueImg2.png"
//         ],
//         priceWithoutDiscount: "200",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "45 grams" },
//       { label: "Battery Life", value: "Up to 7 days" },
//       { label: "Charging Time", value: "Approx. 2 hours" },
//       { label: "Display", value: "1.78-inch AMOLED, 448x368 pixels" },
//       { label: "Connectivity", value: "Bluetooth 5.0, Wi-Fi" },
//       { label: "Water Resistance", value: "5 ATM" },
//       { label: "Sensors", value: "Heart Rate, SpO2, Accelerometer, Gyroscope" },
//     ],
//     productDetailDescription: [
//       "The Zero Luna Smartwatch blends sleek design with cutting-edge features tailored for modern lifestyles. Featuring a vibrant 1.39-inch HD TFT display and a durable zinc alloy body, it offers both style and robustness for daily wear.",
//       "Equipped with Bluetooth 5.2, the Luna allows easy call management and smart notifications directly from your wrist, keeping you connected on the go. It supports comprehensive health monitoring including heart rate, SpO2 tracking, and sleep analysis to help you stay on top of your wellness.",
//       "With IP67 water resistance, the Luna is suitable for everyday use and resistant to splashes and sweat. Its long-lasting battery can keep up with your active lifestyle, delivering up to 7 days on a single charge.",
//     ],
//     warrantyDetails: [
//       "The Zero Luna Smartwatch includes a 1-year limited manufacturer warranty covering defects in materials and workmanship under normal use.",
//       "If you encounter any issues with your device within the warranty period, please contact Zero Lifestyle customer support with your proof of purchase for assistance.",
//       "Warranty services include repair or replacement of defective products at the discretion of the manufacturer.",
//       "Please ensure that the device has not been subjected to physical damage, misuse, or unauthorized modifications as these may void the warranty.",
//       "For any warranty claims, keep the original packaging and accessories intact to facilitate smooth processing.",
//     ],
//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Products must be returned in their original packaging, unused, and with all accessories intact.",
//       "To initiate a return, please contact our customer service to receive a return authorization along with detailed instructions.",
//       "Refunds will be processed via your original payment method once the returned product has been inspected and approved.",
//       "Please note that items damaged due to misuse or those missing packaging/parts are not eligible for return.",
//       "For any questions or assistance, our support team is available to help ensure a smooth return experience.",
//     ]

//   },
//   {
//     productId: "3",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Vip earbuds",
//     description: "Product is amazing",
//     brand: "Ronin",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         stock:200,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       },
//       {
//         variantId: "2",
//         name: "Light green",
//         color: "#22C55E",
//         stock:200,
//         images: [
//           "/assets/earbuds/greenImg1.png",
//           "/assets/earbuds/greenImg2.png"
//         ],
//         priceWithoutDiscount: "1000",
//         discount: "20"
//       },
//       {
//         variantId: "3",
//         name: "Red",
//         color: "#DC2626",
//         stock:150,
//         images: [
//           "/assets/earbuds/redImg1.png",
//           "/assets/earbuds/redImg2.png"
//         ],
//         priceWithoutDiscount: "800",
//         discount: "20"
//       },

//       {
//         variantId: "4",
//         name: "Blue",
//         color: "#60A5FA",
//         stock:250,
//         images: [
//           "/assets/earbuds/blueImg1.png",
//           "/assets/earbuds/blueImg2.png"
//         ],
//         priceWithoutDiscount: "200",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "8 grams" },
//       { label: "Battery Life", value: "Up to 8 hours playback" },
//       { label: "Charging Time", value: "Approx. 1.5 hours" },
//       { label: "Wireless Range", value: "10 meters" },
//       { label: "Bluetooth Version", value: "5.2" },
//       { label: "Water Resistance", value: "IPX5" },
//       { label: "Noise Cancellation", value: "Active Noise Cancellation" },
//     ],
//     productDetailDescription: [
//       "Experience high-fidelity sound with the Zero Gravity earbuds, designed for comfort and superior wireless performance. They feature Active Noise Cancellation, ergonomic design, and long-lasting battery life to keep you connected all day. Compatible with all Bluetooth-enabled devices.",
//       "The earbuds come with a compact charging case and touch controls for easy music and call management. Sweat and water-resistant, perfect for workouts and outdoor use.",
//     ],
//     warrantyDetails: [
//       "The Zero Gravity earbuds come with a 1-year limited manufacturer warranty. This covers any defects in material or workmanship under normal use.",
//       "For warranty service, please contact our customer support with proof of purchase.",
//     ],
//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Items must be returned in original packaging and unused condition.",
//       "To initiate a return, please contact customer service to receive a return authorization and instructions.",
//       "Refunds will be processed to the original payment method after the item is inspected.",
//     ],
//   },
//   {
//     productId: "4",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Dany earbuds",
//     description: "Product is amazing",
//     brand: "Dany",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         stock:200,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       },
//       {
//         variantId: "2",
//         name: "Blue",
//         color: "#60A5FA",
//         stock:1000,
//         images: [
//           "/assets/earbuds/blueImg1.png",
//           "/assets/earbuds/blueImg2.png"
//         ],
//         priceWithoutDiscount: "200",
//         discount: "20"
//       },
//       {
//         variantId: "3",
//         name: "Red",
//         color: "#DC2626",
//         stock:100,
//         images: [
//           "/assets/earbuds/redImg1.png",
//           "/assets/earbuds/redImg2.png"
//         ],
//         priceWithoutDiscount: "800",
//         discount: "20"
//       },
//       {
//         variantId: "4",
//         name: "Light green",
//         color: "#22C55E",
//         stock:400,
//         images: [
//           "/assets/earbuds/greenImg1.png",
//           "/assets/earbuds/greenImg2.png"
//         ],
//         priceWithoutDiscount: "1000",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "8 grams" },
//       { label: "Battery Life", value: "Up to 8 hours playback" },
//       { label: "Charging Time", value: "Approx. 1.5 hours" },
//       { label: "Wireless Range", value: "10 meters" },
//       { label: "Bluetooth Version", value: "5.2" },
//       { label: "Water Resistance", value: "IPX5" },
//       { label: "Noise Cancellation", value: "Active Noise Cancellation" },
//     ],
//     productDetailDescription: [
//       "Experience high-fidelity sound with the Zero Gravity earbuds, designed for comfort and superior wireless performance. They feature Active Noise Cancellation, ergonomic design, and long-lasting battery life to keep you connected all day. Compatible with all Bluetooth-enabled devices.",
//       "The earbuds come with a compact charging case and touch controls for easy music and call management. Sweat and water-resistant, perfect for workouts and outdoor use.",
//     ],
//     warrantyDetails: [
//       "The Zero Gravity earbuds come with a 1-year limited manufacturer warranty. This covers any defects in material or workmanship under normal use.",
//       "For warranty service, please contact our customer support with proof of purchase.",
//     ],
//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Items must be returned in original packaging and unused condition.",
//       "To initiate a return, please contact customer service to receive a return authorization and instructions.",
//       "Refunds will be processed to the original payment method after the item is inspected.",
//     ],
//   },
// ];

// export const saveForLater: Product[] = [
//   {
//     productId: "1",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Gravity earbuds",
//     description: "Product is amazing",
//     brand: "Zero",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         stock:200,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "8 grams" },
//       { label: "Battery Life", value: "Up to 8 hours playback" },
//       { label: "Charging Time", value: "Approx. 1.5 hours" },
//       { label: "Wireless Range", value: "10 meters" },
//       { label: "Bluetooth Version", value: "5.2" },
//       { label: "Water Resistance", value: "IPX5" },
//       { label: "Noise Cancellation", value: "Active Noise Cancellation" },
//     ],
//     productDetailDescription: [
//       "Experience high-fidelity sound with the Zero Gravity earbuds, designed for comfort and superior wireless performance. They feature Active Noise Cancellation, ergonomic design, and long-lasting battery life to keep you connected all day. Compatible with all Bluetooth-enabled devices.",
//       "The earbuds come with a compact charging case and touch controls for easy music and call management. Sweat and water-resistant, perfect for workouts and outdoor use.",
//     ],
//     warrantyDetails: [
//       "The Zero Gravity earbuds come with a 1-year limited manufacturer warranty. This covers any defects in material or workmanship under normal use.",
//       "For warranty service, please contact our customer support with proof of purchase.",
//     ],

//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Items must be returned in original packaging and unused condition.",
//       "To initiate a return, please contact customer service to receive a return authorization and instructions.",
//       "Refunds will be processed to the original payment method after the item is inspected.",
//     ],
//   },
//   {
//     productId: "2",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Audionic earbuds",
//     description: "Product is amazing",
//     brand: "Audionic",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Light green",
//         color: "amber-900",
//         stock:100,
//         images: [
//           "/assets/earbuds/greenImg1.png",
//           "/assets/earbuds/greenImg2.png"
//         ],
//         priceWithoutDiscount: "1000",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "45 grams" },
//       { label: "Battery Life", value: "Up to 7 days" },
//       { label: "Charging Time", value: "Approx. 2 hours" },
//       { label: "Display", value: "1.78-inch AMOLED, 448x368 pixels" },
//       { label: "Connectivity", value: "Bluetooth 5.0, Wi-Fi" },
//       { label: "Water Resistance", value: "5 ATM" },
//       { label: "Sensors", value: "Heart Rate, SpO2, Accelerometer, Gyroscope" },
//     ],
//     productDetailDescription: [
//       "The Zero Luna Smartwatch blends sleek design with cutting-edge features tailored for modern lifestyles. Featuring a vibrant 1.39-inch HD TFT display and a durable zinc alloy body, it offers both style and robustness for daily wear.",
//       "Equipped with Bluetooth 5.2, the Luna allows easy call management and smart notifications directly from your wrist, keeping you connected on the go. It supports comprehensive health monitoring including heart rate, SpO2 tracking, and sleep analysis to help you stay on top of your wellness.",
//       "With IP67 water resistance, the Luna is suitable for everyday use and resistant to splashes and sweat. Its long-lasting battery can keep up with your active lifestyle, delivering up to 7 days on a single charge.",
//     ],
//     warrantyDetails: [
//       "The Zero Luna Smartwatch includes a 1-year limited manufacturer warranty covering defects in materials and workmanship under normal use.",
//       "If you encounter any issues with your device within the warranty period, please contact Zero Lifestyle customer support with your proof of purchase for assistance.",
//       "Warranty services include repair or replacement of defective products at the discretion of the manufacturer.",
//       "Please ensure that the device has not been subjected to physical damage, misuse, or unauthorized modifications as these may void the warranty.",
//       "For any warranty claims, keep the original packaging and accessories intact to facilitate smooth processing.",
//     ],
//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Products must be returned in their original packaging, unused, and with all accessories intact.",
//       "To initiate a return, please contact our customer service to receive a return authorization along with detailed instructions.",
//       "Refunds will be processed via your original payment method once the returned product has been inspected and approved.",
//       "Please note that items damaged due to misuse or those missing packaging/parts are not eligible for return.",
//       "For any questions or assistance, our support team is available to help ensure a smooth return experience.",
//     ]

//   },
//   {
//     productId: "3",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Vip earbuds",
//     description: "Product is amazing",
//     brand: "Ronin",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         stock:100,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "8 grams" },
//       { label: "Battery Life", value: "Up to 8 hours playback" },
//       { label: "Charging Time", value: "Approx. 1.5 hours" },
//       { label: "Wireless Range", value: "10 meters" },
//       { label: "Bluetooth Version", value: "5.2" },
//       { label: "Water Resistance", value: "IPX5" },
//       { label: "Noise Cancellation", value: "Active Noise Cancellation" },
//     ],
//     productDetailDescription: [
//       "Experience high-fidelity sound with the Zero Gravity earbuds, designed for comfort and superior wireless performance. They feature Active Noise Cancellation, ergonomic design, and long-lasting battery life to keep you connected all day. Compatible with all Bluetooth-enabled devices.",
//       "The earbuds come with a compact charging case and touch controls for easy music and call management. Sweat and water-resistant, perfect for workouts and outdoor use.",
//     ],
//     warrantyDetails: [
//       "The Zero Gravity earbuds come with a 1-year limited manufacturer warranty. This covers any defects in material or workmanship under normal use.",
//       "For warranty service, please contact our customer support with proof of purchase.",
//     ],
//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Items must be returned in original packaging and unused condition.",
//       "To initiate a return, please contact customer service to receive a return authorization and instructions.",
//       "Refunds will be processed to the original payment method after the item is inspected.",
//     ],
//   },
//   {
//     productId: "4",
//     categoryId: "1",
//     categoryName: "Earbuds",
//     tag: "Heavy",
//     title: "Dany earbuds",
//     description: "Product is amazing",
//     brand: "Dany",
//     rating: "5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         stock:600,
//         images: [
//           "/assets/earbuds/blackImg1.png",
//           "/assets/earbuds/blackImg2.jpg"
//         ],
//         priceWithoutDiscount: "400",
//         discount: "20"
//       }
//     ],
//     reviews: [
//       {
//         id: 1,
//         name: "Alice Johnson",
//         rating: 4.9,
//         description:
//           "Experience pure sound with Gravity Zero earbuds. Ultra-light, crystal-clear audio, and a secure fit for your active life. Cut the cord and feel the freedom.",
//         date: new Date("2025-08-10"),
//         images: [],
//       },
//       {
//         id: 2,
//         name: "Michael Lee",
//         rating: 4.7,
//         description:
//           "Great earbuds with amazing sound quality. Comfortable for long hours of use.",
//         date: new Date("2025-08-12"),
//         images: [],
//       },
//       {
//         id: 3,
//         name: "Sophia Smith",
//         rating: 5.0,
//         description: "Noise cancellation works perfectly. Battery lasts all day!",
//         date: new Date("2025-08-07"),
//         images: [],
//       },
//       {
//         id: 4,
//         name: "David Brown",
//         rating: 4.8,
//         description:
//           "Very lightweight and fits well. Perfect for workouts and daily commute.",
//         date: new Date("2025-08-14"),
//         images: [],
//       },
//       {
//         id: 5,
//         name: "Emma Wilson",
//         rating: 4.6,
//         description:
//           "Good sound clarity but wish the buds were a bit bigger for my ears.",
//         date: new Date("2025-08-11"),
//         images: [],
//       },
//     ],
//     specifications: [
//       { label: "Weight", value: "8 grams" },
//       { label: "Battery Life", value: "Up to 8 hours playback" },
//       { label: "Charging Time", value: "Approx. 1.5 hours" },
//       { label: "Wireless Range", value: "10 meters" },
//       { label: "Bluetooth Version", value: "5.2" },
//       { label: "Water Resistance", value: "IPX5" },
//       { label: "Noise Cancellation", value: "Active Noise Cancellation" },
//     ],
//     productDetailDescription: [
//       "Experience high-fidelity sound with the Zero Gravity earbuds, designed for comfort and superior wireless performance. They feature Active Noise Cancellation, ergonomic design, and long-lasting battery life to keep you connected all day. Compatible with all Bluetooth-enabled devices.",
//       "The earbuds come with a compact charging case and touch controls for easy music and call management. Sweat and water-resistant, perfect for workouts and outdoor use.",
//     ],
//     warrantyDetails: [
//       "The Zero Gravity earbuds come with a 1-year limited manufacturer warranty. This covers any defects in material or workmanship under normal use.",
//       "For warranty service, please contact our customer support with proof of purchase.",
//     ],
//     returnPloicyDetails: [
//       "We offer a 7-day return policy starting from the date of delivery. Items must be returned in original packaging and unused condition.",
//       "To initiate a return, please contact customer service to receive a return authorization and instructions.",
//       "Refunds will be processed to the original payment method after the item is inspected.",
//     ],
//   },
// ];














































































// wirelessEarbuds

//wirelessHeadphones

//Power Banks

//Mobile Chargers and Cables

//Vapes


// // wirelessHeadphones
// export const wirelessHeadphones: Product[] = [
//   {
//     productId: "5",
//     categoryId: "2",
//     categoryName: "Wireless Headphones",
//     tag: "Premium",
//     title: "SkySound Headphones",
//     description: "High quality wireless headphones with noise cancellation.",
//     brand: "SkyAudio",
//     rating: "4.5",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         images: [
//           "/assets/wirelessHeadphones/blackImg1.png",
//           "/assets/wirelessHeadphones/blackImg2.jpg",
//         ],
//         priceWithoutDiscount: "1200",
//         discount: "15",
//       },
//       {
//         variantId: "2",
//         name: "White",
//         color: "white",
//         images: [
//           "/assets/wirelessHeadphones/whiteImg1.png",
//           "/assets/wirelessHeadphones/whiteImg2.png",
//         ],
//         priceWithoutDiscount: "1250",
//         discount: "10",
//       },
//     ],
//   },
//   {
//     productId: "6",
//     categoryId: "2",
//     categoryName: "Wireless Headphones",
//     tag: "Lightweight",
//     title: "FeatherTone Headphones",
//     description: "Comfortable and long-lasting battery wireless headphones.",
//     brand: "FeatherSound",
//     rating: "4.2",
//     variants: [
//       {
//         variantId: "1",
//         name: "Blue",
//         color: "#60A5FA",
//         images: [
//           "/assets/wirelessHeadphones/blueImg1.png",
//           "/assets/wirelessHeadphones/blueImg2.jpg",
//         ],
//         priceWithoutDiscount: "900",
//         discount: "18"
//       },
//       {
//         variantId: "2",
//         name: "Gray",
//         color: "gray-400",
//         images: [
//           "/assets/wirelessHeadphones/grayImg1.png",
//           "/assets/wirelessHeadphones/grayImg2.png",
//         ],
//         priceWithoutDiscount: "850",
//         discount: "18"
//       },
//     ],
//   },
// ];

// // powerBanks
// export const powerBanks: Product[] = [
//   {
//     productId: "7",
//     categoryId: "3",
//     categoryName: "Power Banks",
//     tag: "Fast Charge",
//     title: "VoltMax Power Bank",
//     description: "Compact and powerful 20000mAh fast charging power bank.",
//     brand: "VoltMax",
//     rating: "4.6",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         images: [
//           "/assets/powerBanks/blackImg1.png",
//           "/assets/powerBanks/blackImg2.jpg",
//         ],
//         priceWithoutDiscount: "2500",
//         discount: "12",
//       },
//       {
//         variantId: "2",
//         name: "Silver",
//         color: "gray-300",
//         images: [
//           "/assets/powerBanks/silverImg1.png",
//           "/assets/powerBanks/silverImg2.png",
//         ],
//         priceWithoutDiscount: "2600",
//         discount: "10",
//       },
//     ],
//   },
//   {
//     productId: "8",
//     categoryId: "3",
//     categoryName: "Power Banks",
//     tag: "Ultra Slim",
//     title: "SlimCharge Power Bank",
//     description: "Ultra slim and lightweight 10000mAh power bank.",
//     brand: "SlimCharge",
//     rating: "4.1",
//     variants: [
//       {
//         variantId: "1",
//         name: "Blue",
//         color: "#60A5FA",
//         images: [
//           "/assets/powerBanks/blueImg1.png",
//           "/assets/powerBanks/blueImg2.jpg",
//         ],
//         priceWithoutDiscount: "1800",
//         discount: "15",
//       },
//     ],
//   },
// ];

// // mobileChargersAndCables
// export const mobileChargersAndCables: Product[] = [
//   {
//     productId: "9",
//     categoryId: "4",
//     categoryName: "Mobile Chargers and Cables",
//     tag: "Fast Charge",
//     title: "QuickCharge USB-C Charger",
//     description: "Fast charging USB-C wall adapter with 30W output.",
//     brand: "ChargePro",
//     rating: "4.7",
//     variants: [
//       {
//         variantId: "1",
//         name: "White",
//         color: "white",
//         images: [
//           "/assets/mobileChargers/whiteChargerImg1.png",
//           "/assets/mobileChargers/whiteChargerImg2.jpg",
//         ],
//         priceWithoutDiscount: "1500",
//         discount: "20",
//       },
//     ],
//   },
//   {
//     productId: "10",
//     categoryId: "4",
//     categoryName: "Mobile Chargers and Cables",
//     tag: "Durable",
//     title: "Nylon Braided USB-C Cable",
//     description: "Durable 1.5m USB-C to USB-C charging cable.",
//     brand: "CablePlus",
//     rating: "4.3",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         images: [
//           "/assets/mobileChargers/blackCableImg1.png",
//           "/assets/mobileChargers/blackCableImg2.jpg",
//         ],
//         priceWithoutDiscount: "500",
//         discount: "10",
//       },
//       {
//         variantId: "2",
//         name: "Red",
//         color: "red-600",
//         images: [
//           "/assets/mobileChargers/redCableImg1.png",
//           "/assets/mobileChargers/redCableImg2.png",
//         ],
//         priceWithoutDiscount: "550",
//         discount: "10",
//       },
//     ],
//   },
// ];

// // vapes
// export const vapes: Product[] = [
//   {
//     productId: "11",
//     categoryId: "5",
//     categoryName: "Vapes",
//     tag: "Starter Kit",
//     title: "VapeX Starter Kit",
//     description: "Compact and easy-to-use vape starter kit with USB charging.",
//     brand: "VapeX",
//     rating: "4.4",
//     variants: [
//       {
//         variantId: "1",
//         name: "Matte Black",
//         color: "#000000",
//         images: [
//           "/assets/vapes/matteBlackImg1.png",
//           "/assets/vapes/matteBlackImg2.jpg",
//         ],
//         priceWithoutDiscount: "3500",
//         discount: "15",
//       },
//       {
//         variantId: "2",
//         name: "Silver",
//         color: "gray-400",
//         images: [
//           "/assets/vapes/silverImg1.png",
//           "/assets/vapes/silverImg2.png",
//         ],
//         priceWithoutDiscount: "3700",
//         discount: "10",
//       },
//     ],
//   },
//   {
//     productId: "12",
//     categoryId: "5",
//     categoryName: "Vapes",
//     tag: "Advanced",
//     title: "VaporPro Advanced Kit",
//     description: "High power vape with adjustable wattage and refillable pods.",
//     brand: "VaporPro",
//     rating: "4.6",
//     variants: [
//       {
//         variantId: "1",
//         name: "Black",
//         color: "#000000",
//         images: [
//           "/assets/vapes/blackImg1.png",
//           "/assets/vapes/blackImg2.jpg",
//         ],
//         priceWithoutDiscount: "5500",
//         discount: "12",
//       },
//     ],
//   },
// ];
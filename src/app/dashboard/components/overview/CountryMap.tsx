// "use client"
// import React from "react";
// // import { VectorMap } from "@react-jvectormap/core";
// import { worldMill, } from "@react-jvectormap/world";
// import dynamic from "next/dynamic";

// const VectorMap = dynamic(
//   () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
//   { ssr: false }
// );

// // Define the component props
// interface CountryMapProps {
//   mapColor?: string;
// }

// type MarkerStyle = {
//   initial: {
//     fill: string;
//     r: number; // Radius for markers
//   };
// };

// type Marker = {
//   latLng: [number, number];
//   name: string;
//   style?: {
//     fill: string;
//     borderWidth: number;
//     borderColor: string;
//     stroke?: string;
//     strokeOpacity?: number;
//   };
// };

// const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
//   return (
//     <VectorMap
//       map={worldMill}
//       backgroundColor="transparent"
//       markerStyle={
//         {
//           initial: {
//             fill: "#465FFF",
//             r: 4, // Custom radius for markers
//           }, // Type assertion to bypass strict CSS property checks
//         } as MarkerStyle
//       }
//       markersSelectable={true}
//       markers={
//         [
//           {
//             latLng: [33.6844, 73.0479],
//             name: "Islamabad",
//             style: {
//               fill: "#465FFF",
//               borderWidth: 1,
//               borderColor: "white",
//               stroke: "#383f47",
//             },
//           },
//           {
//             latLng: [31.5497, 74.3436],
//             name: "Lahore",
//             style: {
//               fill: "#465FFF",
//               borderWidth: 1,
//               borderColor: "white",
//             },
//           },
//           {
//             latLng: [24.8600, 67.0100],
//             name: "Karachi",
//             style: {
//               fill: "#465FFF",
//               borderWidth: 1,
//               borderColor: "white",
//             },
//           },
//           {
//             latLng: [34.0151, 71.5249],
//             name: "Peshawar",
//             style: {
//               fill: "#465FFF",
//               borderWidth: 1,
//               borderColor: "white",
//               strokeOpacity: 0,
//             },
//           },
//           {
//             latLng: [30.1575, 71.5249],
//             name: "Multan",
//             style: {
//               fill: "#465FFF",
//               borderWidth: 1,
//               borderColor: "white",
//               strokeOpacity: 0,
//             },
//           },
//           {
//             latLng: [30.1798, 66.9750],
//             name: "Quetta",
//             style: {
//               fill: "#465FFF",
//               borderWidth: 1,
//               borderColor: "white",
//               strokeOpacity: 0,
//             },
//           },
//         ]
//       }

//       zoomOnScroll={false}
//       zoomMax={12}
//       zoomMin={1}
//       zoomAnimate={true}
//       zoomStep={1.5}
//       regionStyle={{
//         initial: {
//           fill: mapColor || "#D0D5DD",
//           fillOpacity: 1,
//           fontFamily: "Outfit",
//           stroke: "none",
//           strokeWidth: 0,
//           strokeOpacity: 0,
//         },
//         hover: {
//           fillOpacity: 0.7,
//           cursor: "pointer",
//           fill: "#465fff",
//           stroke: "none",
//         },
//         selected: {
//           fill: "#465FFF",
//         },
//         selectedHover: {},
//       }}
//       regionLabelStyle={{
//         initial: {
//           fill: "#35373e",
//           fontWeight: 500,
//           fontSize: "13px",
//           stroke: "none",
//         },
//         hover: {},
//         selected: {},
//         selectedHover: {},
//       }}
//       focusOn={{ 
//         region:"PK",
//         scale:5,
//         animate:true,
//         x:0.5,
//         y:0.5
//       }}
//     />
//   );
// };

// export default CountryMap;

import { NextResponse } from "next/server";

export async function GetAttractions() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/attractions?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Failed to fetch attractions:", error);
    return NextResponse.json(
      { error: "Failed to fetch attractions" },
      { status: 500 },
    );
  }
}

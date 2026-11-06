export type Listing = {
  id: string;
  title: string;
  address: string;
  city: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images: string[];
  petFriendly: boolean;
};

function listing(
  id: string,
  title: string,
  address: string,
  city: string,
  zip: string,
  price: number,
  beds: number,
  baths: number,
  sqft: number,
  petFriendly: boolean,
): Listing {
  const image = `https://picsum.photos/seed/rentbridge${id}/800/600`;
  return {
    id,
    title,
    address,
    city,
    zip,
    price,
    beds,
    baths,
    sqft,
    petFriendly,
    image,
    images: [image],
  };
}

export const listings: Listing[] = [
  // Oklahoma
  listing("1", "Downtown Studio near Bricktown", "120 E Sheridan Ave", "Oklahoma City, OK", "73104", 950, 0, 1, 520, true),
  listing("2", "Bright 2BR in Midtown", "1010 NW 10th St", "Oklahoma City, OK", "73106", 1350, 2, 1, 910, false),
  listing("3", "Modern 1BR Tulsa Arts District", "215 E Archer St", "Tulsa, OK", "74103", 1100, 1, 1, 700, true),
  listing("4", "Family 3BR Townhome", "2200 Lindsey St", "Norman, OK", "73069", 1650, 3, 2, 1450, true),
  listing("5", "Spacious 2BR Apartment", "340 N Broadway", "Edmond, OK", "73034", 1400, 2, 2, 1050, true),
  listing("6", "Affordable 1BR near Fort Sill", "815 SW C Ave", "Lawton, OK", "73501", 780, 1, 1, 650, false),
  // Texas
  listing("7", "High-Rise 1BR in Uptown", "2800 McKinney Ave", "Dallas, TX", "75204", 1850, 1, 1, 780, true),
  listing("8", "Garden-Style 2BR", "4500 Greenville Ave", "Dallas, TX", "75206", 1550, 2, 2, 1020, true),
  listing("9", "Midtown Loft", "1600 Main St", "Houston, TX", "77002", 1750, 1, 1, 850, false),
  listing("10", "Family 3BR near the Galleria", "5100 Westheimer Rd", "Houston, TX", "77056", 2400, 3, 2, 1500, true),
  listing("11", "Downtown Austin Studio", "500 E 6th St", "Austin, TX", "78701", 1500, 0, 1, 480, false),
  listing("12", "Sunny 2BR South Congress", "1400 S Congress Ave", "Austin, TX", "78704", 2300, 2, 2, 1100, true),
  listing("13", "Riverwalk 1BR", "210 S Alamo St", "San Antonio, TX", "78205", 1250, 1, 1, 740, true),
  listing("14", "Cultural District 2BR", "3300 Camp Bowie Blvd", "Fort Worth, TX", "76107", 1600, 2, 2, 1080, true),
  listing("15", "Modern 4BR Home", "7700 Legacy Dr", "Plano, TX", "75024", 3400, 4, 3, 2200, true),
  listing("16", "Budget-Friendly 1BR", "901 N Collins St", "Arlington, TX", "76011", 1050, 1, 1, 690, false),
  // Colorado
  listing("17", "Modern Loft in LoDo", "1650 Wewatta St", "Denver, CO", "80202", 2350, 1, 1, 780, true),
  listing("18", "Sunny 2BR near Pearl Street", "1125 Spruce St", "Boulder, CO", "80302", 2900, 2, 1, 950, false),
  listing("19", "Cozy Townhome by Old Town", "312 Mountain Ave", "Fort Collins, CO", "80524", 2150, 2, 2, 1100, true),
  listing("20", "Mountain View Apartment", "804 N Tejon St", "Colorado Springs, CO", "80903", 1650, 1, 1, 700, true),
];
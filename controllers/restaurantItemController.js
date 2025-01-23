const RestaurantItem = require('../models/RestaurantItem');
console.log(RestaurantItem); 

const createRestaurantItem = async (req, res) => {
  const { restaurantName, location, cuisine, slots } = req.body;

  if (
    !restaurantName ||
    !location ||
    !cuisine ||
    !slots ||
    !Array.isArray(slots)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid input. Please provide all required fields." });
  }

  try {
    const existingRestaurant = await RestaurantItem.findOne({
      name: restaurantName,
      location,
    });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    const restaurant = new RestaurantItem({
      name: restaurantName,
      location,
      cuisine,
      availableSlots: slots.map((slot) => ({
        date: new Date(slot.date),
        time: slot.time,
        available: true,
      })),
    });

    await restaurant.save();

    res.status(201).json({
      message: "Restaurant item created successfully",
      restaurant: {
        name: restaurant.name,
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        slots: restaurant.availableSlots.map(
          (slot) => `${slot.date.toISOString().split("T")[0]} ${slot.time}`
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating restaurant item", error });
  }
};

module.exports = { createRestaurantItem };

import Hotel from "./../models/hotel.model.js";

export const getHotels = async (req, res) => {
  try {
    let hotels = {};
    if (req.params.id) {
      hotels = await Hotel.findById(req.params.id);
    } else {
      hotels = await Hotel.find();
    }
    return res.status(200).json(hotels);
  } catch (error) {
    return res.status(404).json({ message: "Hotel not found." });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(hotel);
  } catch (error) {
    return res.status(404).json({ message: "Hotel not found." });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Hotel has been deleted." });
  } catch (error) {
    return res.status(404).json({ message: "Hotel not found." });
  }
};

export const createHotel = async (req, res) => {
  const hotel = new Hotel(req.body);
  try {
    const savedHotel = await hotel.save();
    return res.status(200).json(savedHotel);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

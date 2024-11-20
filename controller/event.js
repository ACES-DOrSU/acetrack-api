import {
  getEvent,
  getEventById,
  createEvent,
  updateEvent,
  uploadEventBanner,
  deleteEvent,
} from "../model/EventModel.js";
import { ulid } from "ulidx";
import { getCloudinaryPublicId } from "../helper/getPublicId.js";
import { v2 as cloudinary } from "cloudinary";

export const insertEvent = async (req, res, next) => {
  try {
    const data = req.body;
    const eventId = ulid(); //generate unique id
    const status = "0";

    const eventData = {
      id: eventId,
      name: data.name,
      description: data.description,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      status: status,
    };

    await createEvent(eventData);

    res.status(201).json({ success: true, message: "Event created" });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};

export const modifyEvent = async (req, res, next) => {
  const data = req.body;
  try {
    // Find the event by id
    const [events] = await getEventById(req.params.id);
    const event = events[0];

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    // Use existing values if the new data is an empty string or null
    const eventData = {
      name: data.name || data.name, // If data.name is empty or null, fallback to data.firstname
      description: data.description || data.description,
      location: data.location || data.location,
      startDate: data.startDate || data.startDate,
      endDate: data.endDate || data.endDate,
      status: data.status || data.status,
    };

    await updateEvent(req.params.id, eventData);

    res.status(200).json({
      success: true,
      message: "Event updated",
    });
  } catch (err) {
    //check if invalid id format
    if (err.name === "Cast Error") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};

export const uploadBanner = async (req, res, next) => {
  const banner = req.file; // Access the uploaded file

  //require upload  banner
  if (!banner) {
    const error = new Error("No banner uploaded");
    error.status = 400;
    error.success = false;
    return next(error);
  }

  try {
    // Find the user by id
    const [events] = await getEventById(req.params.id);
    const event = events[0];

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    // If the event has an existing baner in Cloudinary, delete it
    if (event.banner) {
      const publicId = `acetrack/${getCloudinaryPublicId(event.banner)}`;

      await cloudinary.uploader.destroy(publicId);
      console.log("Old banner deleted from Cloudinary");
    }

    //get file url
    const filePath = req.file.path;

    // // Update the event's baner in the database with the Cloudinary URL
    await uploadEventBanner(req.params.id, filePath);

    res.status(200).json({
      success: true,
      message: "Banner uploaded successfully!",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};
//fetch event by id
export const findEvent = async (req, res, next) => {
  try {
    // Find the event by id
    const [events] = await getEventById(req.params.id);
    const event = events[0];

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    //check if invalid id format
    if (err.name === "Cast Error") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};

export const getEvents = async (req, res, next) => {
  try {
    const [events] = await getEvent();

    if (events.length <= 0) {
      const error = new Error("No events found");
      error.status = 200;
      error.success = true;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    //check if invalid id format
    if (err.name === "Cast Error") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};

export const removeEvent = async (req, res, next) => {
  try {
    // Find the event by id
    const [events] = await getEventById(req.params.id);
    const event = events[0];

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }
     // If the event has an existing baner in Cloudinary, delete it
     if (event.banner) {
      const publicId = `acetrack/${getCloudinaryPublicId(event.banner)}`;

      await cloudinary.uploader.destroy(publicId);
      console.log("Old banner deleted from Cloudinary");
    }

    const isDeleted = await deleteEvent(req.params.id);

    res.status(200).json({
      success: true,
      data: "Event removed",
    });
  } catch (err) {
    //check if invalid id format
    if (err.name === "Cast Error") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};

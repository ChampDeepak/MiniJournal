import Entry from "../models/entry.model.js";

/* Create New Entry Controller
Assumptions 
//auth middleware attaches req.userId after verifying the token
//Dates are sent in ISO string format (e.g. "2025-09-15")
Dummy Request Body  

{
  "date": "2025-09-15",
  "content": "Today I built my first fullstack app!"
}

*/
export const createEntry = async (req, res) => {
  try {
    const { date, content } = req.body;

    if (!date || !content) {
      return res.status(400).json({ message: "Date and content are required" });
    }

    // userId comes from authentication middleware (e.g., after JWT verification)
    const userId = req.userId;

    const entry = new Entry({
      userId,
      date: new Date(date),
      content
    });

    await entry.save();

    res.status(201).json({
      id: entry._id,
      date: entry.date,
      content: entry.content
    });
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ message: "Server error while creating entry" });
  }
};


// Get Entry Controller
export const getEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.userId })
      .sort({ date: -1 }); // reverse chronological (newest first)

    const response = entries.map(entry => ({
      id: entry._id,
      date: entry.date,
      content: entry.content
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Server error while fetching entries" });
  }
};

/* Patch controller 
Dummy Input id of entery can be taken from here 
{
        "id": "68c7c39f2d9ac45ea05c246b",
        "date": "2025-09-15T00:00:00.000Z",
        "content": "Radhe Radhe"
    }
*/
export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Find entry and ensure it belongs to the user
    const entry = await Entry.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { content },
      { new: true } // return the updated document
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found or not authorized" });
    }

    res.status(200).json({
      id: entry._id,
      date: entry.date,
      content: entry.content
    });
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ message: "Server error while updating entry" });
  }
};


/*  Delete Controller
    Delete api was tested on entry id param = 68c7c23c8088f7298c36150a
*/
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await Entry.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found or not authorized" });
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Server error while deleting entry" });
  }
};


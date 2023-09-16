const Kids = require("../../models/health/KidsDeathFrom1YearToLessThan5Year");
var fs = require("fs");
const request = require("request");
const path = require("path");
const getKids = async (req, res) => {
  try {
    const kids = await Kids.aggregate([
      {
        $group: {
          _id: {
            year: "$السنة",
            residence: "$محل الإقامة",
            sex: "$النوع",
          },
          total: {
            $sum: "$وفيات الاطفال (من سنة - أقل من 5 سنوات)",
          },
        },
      },
    ]);

    res.json(kids);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
const getKidsByCity = async (req, res) => {
  try {
    const kids = await Kids.aggregate([
      {
        $match: {
          المحافظة: req.params.city,
        },
      },
      {
        $group: {
          _id: {
            sex: "$النوع",
          },
          total: {
            $sum: "$وفيات الاطفال (من سنة - أقل من 5 سنوات)",
          },
        },
      },
    ]);

    res.json(kids);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

const importData = async (req, res) => {
  const { json } = req.body;
  console.log(json);
  try {
    await Kids.deleteMany();

    request(
      {
        url: json,
        json: true,
      },
      async (err, res, data) => {
        if (err) {
          console.log(err);
          //res.send({ msg: err.message });
        }
        //console.log(data);
        const createdData = await Kids.insertMany(data);
        //res.send("data imported");
      }
    );
    res.json("Data Imported");

    //console.log("Data Imported");
  } catch (err) {
    //console.error(`${err}`);
    res.json({ msg: err.message });
    process.exit(1);
  }
};
module.exports = {
  getKids,
  getKidsByCity,
  importData,
};

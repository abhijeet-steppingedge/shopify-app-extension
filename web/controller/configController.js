import express from "express";
import shopify from "../shopify.js";
import config from "../config.js";
import db from "../db.js";

const app = express.Router();



// Get Template with Saved data
app.get("/api/saved/template", async (req, res) => {
  try {

    let shop = res.locals.shopify.session.shop;
    let type = req.query.type;

    db.all(`
      SELECT *, 
      (SELECT temp_id FROM shopify_saved_template s
      WHERE s.type = ?
      AND s.shop = ?
      AND s.webhook = t.webhook
      ) as temp_id
      FROM shopify_${type}_template t
      WHERE t.accessByStore IS NULL 
      OR t.accessByStore = ?
      ORDER BY t.webhook
    `,[type, shop, shop], (err, rows) => {
      if (err) {
        res.status(500).json({error: err });
      } else {

        db.get(`
          SELECT status FROM shopify_saved_template s
          WHERE s.type = ?
          AND s.shop = ?
          GROUP BY s.status
        `,[type, shop], (err, row) => {
          if (err) {
            res.status(500).json({error: err });
          } else {
            let status = row?.status || false;
            res.status(200).json({data: rows, notificationStatus: status});
          }
        })
      }
    });

    // await db.close();
  } catch (error) {
    res.status(500).json({error: error.message });

  }
});

// Get SMS Template with Saved data
// app.get("/api/sms/template", async (req, res) => {
//     try {

//       let shop = res.locals.shopify.session.shop;
//       let type = 'sms';

//       db.all(`
//       SELECT *, 
//       (SELECT temp_id FROM shopify_saved_template s
//       WHERE s.type = ?
//       AND s.shop = ?
//       AND s.webhook = t.webhook
//       ) as temp_id
//       FROM shopify_sms_template t
//       WHERE t.accessByStore IS NULL 
//       OR t.accessByStore = ?
//       ORDER BY t.webhook
//       `,[type, shop], (err, rows) => {
//         if (err) {
//           res.status(500).json({error: err });
//         } else {
//           res.status(200).json({data: rows});
//         }
//       });
  
//       // await db.close();
//     } catch (error) {
//       res.status(500).json({error: error.message });
//     }
// });


// Save bulk template
app.post("/api/template/bulk/save", async (req, res) => {

  try {

    let type = req.body.type;
    let status = req.body.status ? 1 : 0;
    let webhooks = req.body.webhook;
    let shop = res.locals.shopify.session.shop;
    
    for (const [webhook, temp_id] of Object.entries(webhooks)) {

      await new Promise((resolve, reject) => {
        // Check if a record with matching shop and type values exists
        db.get('SELECT * FROM shopify_saved_template WHERE shop = ? AND type = ? AND webhook = ?', 
        [shop, type, webhook], 
        (err, row) => {
          if (err) {
            reject(err);
          } else if (row) { 
            // If a matching record exists, update the temp_id value
            db.run('UPDATE shopify_saved_template SET temp_id = ?, status = ? WHERE shop = ? AND type = ? AND webhook = ?', 
            [temp_id, status, shop, type, webhook], 
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(`Successfully updated shopify_saved_template for ${shop} and ${type}`);
              }
            });
          } else { 
            // If no matching record exists, insert a new record with the provided values
            db.run('INSERT INTO shopify_saved_template (shop, type, webhook, temp_id, status) VALUES (?, ?, ?, ?, ?)', 
            [shop, type, webhook, temp_id, status], 
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(`Successfully inserted new shopify_saved_template for ${shop} and ${type}`);
              }
            });
          }
        });
      });
    }

    res.status(200).json(true);

  } catch (error) {
    res.status(500).json({error: error });
  }
});

export default app;

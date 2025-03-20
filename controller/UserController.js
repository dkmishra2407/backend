const userModel = require('../models/userSchema')
const mongoose = require('mongoose');
const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const bcrypt = require('bcrypt')
// const jwt = require("jsonwebtoken");

module.exports.get_all_user = async(req,res) =>{
    try{
        const users = await userModel.find();

        if(!users){
            return res.status(200).json(
                {
                    status:200,
                    message: "Users fetched successfully But No user Found",
                    data: users
                }
            )
        }
        return res.status(200).json({
            status:200,
            message: "Users fetched successfully",
            data: users
        })
    }
    catch{
        console.log(err);
        return res.status(500).json({
            status:500,
            message: "Sever error"
        })
    }
}

module.exports.add_new_user = async(req,res) =>{
    try{
        const {username,password,mobileNo,email} = req.body;

        // CHECK DATA IS CORRECT OR NOT 

        if(!username || !password || !mobileNo || !email){
            return res.status(400).json({
                status: 400,
                message: "please provide all fields"
            })
        }

        // CHECK THE USERID IS ALREADY EXIST OR NOT 

        const user = await userModel.findOne({
            username: username
        })

        if(user){
            return res.status(400).json({
                status:400,
                message: "User Already Exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user1 = new userModel({
            username:username,
            password: hashPassword,
            mobileNo: mobileNo,
            email: email
        })

        await user1.save();

        return res.status(200).json({
            status: 200,
            message: "User Registered Successfully"
        })
    }
        // console.error();
    catch{
            console.log(e);
            res.status(500).json({ 
                status: 500, 
                message: e.message 
            });       
    }
}

module.exports.get_user = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                message: "Please provide all fields"
            });
        }

        // Fetch user by username
        const userdetail = await userModel.findOne({ username: username });

        if (!userdetail) {
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            });
        }

        // Debugging logs
        console.log("User found:", userdetail);
        console.log("Stored hashed password:", userdetail.password);
        console.log("Entered password:", password);

        // Ensure password exists before comparing
        // if (!userdetail.password) {
        //     return res.status(500).json({
        //         status: 500,
        //         message: "User password is missing in the database"
        //     });
        // }

        // Compare the entered password with the stored hash
        const passwordMatch = await bcrypt.compare(password, userdetail.password);

        if (!passwordMatch) {
            return res.status(400).json({
                status: 400,
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User Fetched Successfully",
            data: userdetail
        });

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
};


module.exports.findByUsername = async (req, res) => {
    try {
        const { username } = req.params; 
        console.log(username)
        if (!username) {
            return res.status(400).json({
                status: 400,
                message: "Please provide a username."
            });
        }

        const userdetail1 = await userModel.find({ username });

        if (userdetail1.length === 0) { // Check if the user exists
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User Fetched Successfully",
            data: userdetail1
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports.deleteuser = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({
                status: 400,
                message: "Please provide a username."
            });
        }

        const deletinguser = await userModel.findOne({ username });

        if (!deletinguser) { // Check if user exists
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            });
        }

        await deletinguser.deleteOne(); 

        return res.status(200).json({
            status: 200,
            message: "User Deleted Successfully"
        });
    } 
    catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({
            status: 500,
            message: "Error while deleting user"
        });
    }
};

module.exports.updateuser = async (req, res) => {
    try {
        const { username } = req.params;
        const { newusername, newpassword, newmobileNo, newemail } = req.body;

        if (!username) {
            return res.status(400).json({
                status: 400,
                message: "Please provide a username."
            });
        }

        const user = await userModel.findOne({ username });

        if (!user) { // Check if user exists
            return res.status(404).json({
                status: 404,
                message: "User Not Found"
            });
        }

        // Check if at least one field is provided for update
        if (!newusername && !newpassword && !newmobileNo && !newemail) {
            return res.status(400).json({
                status: 400,
                message: "Please provide at least one field to update."
            });
        }

        const updateData = {};
        if (newusername) updateData.username = newusername;
        if (newpassword) updateData.password = newpassword;
        if (newmobileNo) updateData.mobileNo = newmobileNo;
        if (newemail) updateData.email = newemail;

        await userModel.updateOne({ username }, { $set: updateData });

        return res.status(200).json({
            status: 200,
            message: "User Updated Successfully"
        });
    } 
    catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({
            status: 500,
            message: "Error while updating user"
        });
    }
};
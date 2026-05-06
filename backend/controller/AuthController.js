const bcrypt = require('bcrypt');
const User = require('../model/user');

exports.Register = async (req,res) => {
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
                return res.status(400).json({
                    message:"Please fill all column"
                });
        }

        const exist = await User.findOne({email});
        if(exist){
            return res.status(400).json({
                message:"Allready Loggined"
            })
        }


        const HashPass = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:HashPass,
            role:"user" 
            
        });

        await user.save()
        res.json({
            success:true,
            message:"User SignUp Successfully"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Server Error"
        })
    };
}


exports.login = async (req,res)=> {
  try{
    const {email,password} = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch) return res.status(401).json({ message: "Invalid password" });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({ 
      message: "Login successful",
      user: safeUser 
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


//sare user ko show krane k liye get method
exports.AllUsers = async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({err:err.message})
    }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role, name, email } = req.body;

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(typeof name !== "undefined" ? { name } : {}),
        ...(typeof email !== "undefined" ? { email } : {}),
        ...(typeof role !== "undefined" ? { role } : {}),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


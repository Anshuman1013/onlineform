const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @description Get goals
// @route GET /api/goals
// @access private after authorization
const getGoals = asyncHandler(async (req,res) => {
    const goals = await Goal.find({ user : req.user.id})


    res.status(200).json(goals)
})



// @description set goals
// @route POST /api/goals
// @access private after authorization
const setGoals = asyncHandler(async (req,res) => {
    // if(!req.body.Name){
    //     res.status(400)
    //     throw new Error('Please Add a Name Field')
    // }
    const goals = await Goal.create({
        text: req.body.text,
        user: req.user.id,
    })
    res.status(200).json(goals)
})



// @description update goals
// @route GET /api/goals/:id
// @access private after authorization
const updateGoals = asyncHandler(async (req,res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    //check user exist
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // Make sure the logged in user matched the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not Authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
    })

    res.status(200).json(updatedGoal)
})





// @description delete goals
// @route GET /api/goals/:id
// @access private after authorization
const deleteGoals = asyncHandler(async (req,res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    //check user exist
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    // Make sure the logged in user matched the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not Authorized')
    }

    await goal.remove()
    res.status(200).json({id : req.params.id})
})

module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals,
}
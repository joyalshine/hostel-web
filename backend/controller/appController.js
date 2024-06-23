const cleaningModel = require('../models/cleaningModel')
const disciplineModel = require('../models/disciplineModel')
const messModel = require('../models/messModel')
const maintenanceModel = require('../models/maintenanceModel')

const messMenuModel = require('../models/messMenuModel')

module.exports = {
    addCleaningRequest: async (req, res, next) => {
        const { data } = req.body
        try {
            let complaintResponse = new cleaningModel(data)
            complaintResponse.save()
                .then((doc) => {
                    res.status(200).json({ status: true, data: complaintResponse })
                })
                .catch((err) => {
                    res.status(400).json({ status: false })
                })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    },

    addMaintenaceRequest: async (req, res, next) => {
        const { data } = req.body
        try {
            console.log(data)
            let complaintResponse = new maintenanceModel(data)
            complaintResponse.save()
                .then((doc) => {
                    res.status(200).json({ status: true, data: complaintResponse })
                })
                .catch((err) => {
                    res.status(400).json({ status: false })
                })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    },

    addMessRequest: async (req, res, next) => {
        const { data } = req.body
        console.log(req.headers)
        try {
            let complaintResponse = new messModel(data)
            complaintResponse.save()
                .then((doc) => {
                    res.status(200).json({ status: true, data: complaintResponse })
                })
                .catch((err) => {
                    res.status(400).json({ status: false })
                })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    },

    addDisciplineRequest: async (req, res, next) => {
        const { data } = req.body
        try {
            let complaintResponse = new disciplineModel(data)
            complaintResponse.save()
                .then((doc) => {
                    res.status(200).json({ status: true, data: complaintResponse })
                })
                .catch((err) => {
                    res.status(400).json({ status: false })
                })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    },

    fetchAlluserComplaints: async (req, res, next) => {
        const { email } = req.body.data
        try {
            const discipline = await disciplineModel.find({ studentEmail: email })
            const cleaning = await cleaningModel.find({ studentEmail: email })
            const maintenance = await maintenanceModel.find({ studentEmail: email })
            const mess = await messModel.find({ studentEmail: email })

            res.status(200).json({ status: true, data: { discipline, cleaning, maintenance, mess } })
        }
        catch (err) {
            res.status(400).json({ status: false })
        }
    },

    fetchMenu: async (req, res, next) => {
        const { key } = req.body.data
        try {
            const menu = await messMenuModel.findOne({ key })
            if (menu) {
                console.log(menu)
                console.log({ 'status': true, 'data': menu['menu'], 'key': key })
                res.status(200).json({ 'status': true, 'data': menu.menu, 'key': key })
            }
            else {
                res.status(400).json({ 'status': true,'type': null })
            }
        }
        catch (err) {
            res.status(400).json({ 'status': false, 'type': 'error' })
        }
    },

    fetchIndividualComplaint: async (req, res, next) => {
        const { id, collection } = req.body.data
        try {
            let complaint;
            if (collection == 'maintenance') {
                complaint = await maintenanceModel.findById(id)
            }
            else if (collection == 'cleaning') {
                complaint = await cleaningModel.findById(id)
            }
            else if (collection == 'mess') { 
                complaint = await messModel.findById(id)
            }
            else {
                complaint = await disciplineModel.findById(id)
            }
            res.status(200).json({ 'status': true, 'data': complaint})
        }
        catch (err) {
            res.status(400).json({ 'status': false, 'type': 'error' })
        }
    },
}
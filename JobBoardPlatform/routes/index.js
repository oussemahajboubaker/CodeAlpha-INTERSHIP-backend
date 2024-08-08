// routes/index.js
const express = require('express');
const router = express.Router();
const Jobs = require("../model/jobs");
const { where } = require('sequelize');

router.get('/', (req, res) => {
    const welcomeMessage = "Welcome to our Job Board Platform! Below are the all available routes";

    // Function to gather information about all routes
    const getAllRoutesInfo = () => {
        const routesInfo = [];
        router.stack.forEach((route) => {
            if (route.route) {
                const routeInfo = {
                    path: route.route.path,
                    methods: route.route.methods
                };
                routesInfo.push(routeInfo);
            }
        });

        return routesInfo;
    };

    // Get information about all routes
    const allRoutesInfo = getAllRoutesInfo();
    res.send(`<h1>${welcomeMessage}</h1><pre>${JSON.stringify(allRoutesInfo, null, 2)}</pre>`);
});

// Job listings route
router.get('/showjobs', async (req, res) => {
    try {
        const alljobs = await Jobs.findAll();

        if (alljobs.length === 0) {
            res.status(200).json({
                message: "Oops! No Jobs Found"
            });
        } else {
            res.status(200).json({
                message: `${alljobs.length} Jobs Found`,
                Jobslist: alljobs
            });
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});


// Job posting route
router.post('/postjob', async (req, res) => {
    try {
        const { jobtitle, company, location, experienceInYear, salaryInLPA, jobdescription } = req.body;

        const existingJobs = await Jobs.findOne({
            where: {
                jobtitle: jobtitle,
                company: company
            }
        });

        if (existingJobs) {
            res.status(201).send({
                message: "Job Already Posted!",
                description: ` ${existingJobs.jobtitle} Jobs Found from ${existingJobs.company} is already exist!`
            });
        } else {
            const newJob = await Jobs.create({
                jobtitle,
                company,
                location,
                experienceInYear,
                salaryInLPA,
                jobdescription
            });
            res.status(200).send({
                message: "Job Posted Successfully!",
                data: newJob
            });
        }

    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).send({
            error: "Internal Server Error"
        });
    }
});

router.post('/jobs/filter', async (req, res) => {
    try {
        const { jobtitle, company, location, experienceInYear, salaryInLPA } = req.body;

        if (!jobtitle && !company && !location && !experienceInYear && !salaryInLPA) {
            return res.status(400).json({ error: 'At least one filter criteria is required' });
        }
        const filter = {};
        if (jobtitle) filter.jobtitle = jobtitle;
        if (company) filter.company = company;
        if (location) filter.location = location;
        if (experienceInYear) filter.experienceInYear = experienceInYear;
        if (salaryInLPA) filter.salaryInLPA = salaryInLPA;
        const filteredJobs = await Jobs.findAll({ where: filter });
        return res.status(200).json({
            message: `${filteredJobs.length} Filtered Jobs Found`,
            jobs: filteredJobs
        });
    } catch (error) {
        console.error('Error filtering jobs:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/jobs/calculate', async (req, res) => {
    try {
        const allJobs = await Jobs.findAll();

        if (allJobs.length === 0) {
            res.status(200).json({
                message: "No jobs available for calculations"
            });
        } else {
            const totalSalaries = allJobs.reduce((sum, job) => sum + job.salaryInLPA, 0);
            const averageSalary = totalSalaries / allJobs.length;

            res.status(200).json({
                message: "Calculation results",
                totalJobs: allJobs.length,
                averageSalary: averageSalary
            });
        }
    } catch (error) {
        console.error('Error performing calculations on jobs:', error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});

module.exports = router;

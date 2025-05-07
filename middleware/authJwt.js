const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/auth.config'); // Importez la configuration

/*
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Token not provided' });
        }
        const decoded = jwt.verify(token, config.secret); // Utilisez la clé secrète de la configuration
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
*/

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Token not provided or invalid format');
            return res.status(403).json({ message: 'Token not provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token received:', token);

        const decoded = jwt.verify(token, config.secret);
        console.log('Decoded token:', decoded);

        req.userData = decoded;
        next();
    } catch (error) {
        console.log('Token verification error:', error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};


const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const isProjetManager = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.userId);
        if (user.role !== 'projetManager') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const isTaskManager = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.userId);
        if (user.role !== 'taskManager') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const isSiteManager = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.userId);
        if (user.role !== 'siteManager') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const isClient = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.userId);
        if (user.role !== 'client') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const isWorksManager = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userData.userId);
        if (user.role !== 'worksManager') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isProjetManager,
    isTaskManager,
    isSiteManager,
    isClient,
    isWorksManager
};

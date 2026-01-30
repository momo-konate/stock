import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } =
      req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Sécurité : Forcer le rôle
    // Un admin crée des vendeurs, un inconnu crée un compte admin
    const finalRole = req.user ? "seller" : "admin";

    const user = await User.create({
      username,
      email,
      password,
      role: finalRole,
      securityQuestion,
      securityAnswer: securityAnswer ? securityAnswer.toLowerCase() : null,
      parentId: req.user ? req.user.id : null,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.comparePassword(password))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.securityAnswer) {
      return res
        .status(400)
        .json({
          message: "Aucune question de sécurité configurée pour ce compte",
        });
    }

    const isAnswerValid = await user.verifySecurityAnswer(securityAnswer);
    if (!isAnswerValid) {
      return res
        .status(401)
        .json({ message: "Réponse à la question de sécurité incorrecte" });
    }

    user.password = newPassword;
    await user.save(); // Le hook beforeUpdate hashéra le mot de passe

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la réinitialisation",
        error: error.message,
      });
  }
};

export const getSecurityQuestion = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.securityQuestion) {
      return res
        .status(400)
        .json({ message: "Aucune question de sécurité configurée" });
    }

    res.json({ question: user.securityQuestion });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { parentId: req.user.id },
      attributes: ["id", "username", "email", "role", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        error: error.message,
      });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, parentId: req.user.id },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé ou non autorisé" });
    }

    // Empêcher de se supprimer soi-même
    if (user.id === req.user.id) {
      return res
        .status(400)
        .json({
          message: "Vous ne pouvez pas supprimer votre propre compte admin",
        });
    }

    await user.destroy();
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

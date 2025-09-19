-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 07 sep. 2025 à 09:58
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestionlivres`
--

-- --------------------------------------------------------

--
-- Structure de la table `adherent`
--

CREATE TABLE `adherent` (
  `id_adherent` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `fonction` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `adherent`
--

INSERT INTO `adherent` (`id_adherent`, `nom`, `prenom`, `fonction`, `telephone`) VALUES
(1, 'Rakoto', 'Jean', 'Magistrat', '0321234563'),
(2, 'Randria', 'Sofia', 'Greffier', '0337654321'),
(3, 'Rabe', 'Michel', 'Secrétaire', '0341122334'),
(4, 'Rahaga', 'mika', 'chef', '0384392091');

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id_admin`, `username`, `password`) VALUES
(1, 'president', '1234');

-- --------------------------------------------------------

--
-- Structure de la table `livre`
--

CREATE TABLE `livre` (
  `id_livre` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `auteur` varchar(255) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `annee_edition` int(11) NOT NULL,
  `en_pret` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `livre`
--

INSERT INTO `livre` (`id_livre`, `titre`, `auteur`, `categorie`, `annee_edition`, `en_pret`) VALUES
(1, 'Le Petit Prince', 'Antoine de Saint-Exupéry', 'Fiction', 1943, 1),
(2, 'L\'Étranger', 'Albert Camus', 'Roman', 1942, 0),
(3, '1984', 'George Orwell', 'Science-fiction', 1949, 1),
(4, 'Les Misérables', 'Victor Hugo', 'Classique', 1862, 1),
(5, 'L\'Art de la Guerre', 'Sun Tzu', 'Philosophie', 500, 0),
(6, 'La Peste', 'Albert Camus', 'Roman philosophique', 1947, 0),
(7, 'La Condition humaine', 'André Malraux', 'Roman historique', 1933, 0),
(8, 'Voyage au centre de la Terre', 'Jules Verne', 'Science-fiction', 1864, 0),
(9, 'Notre-Dame de Paris', 'Victor Hugo', 'Roman historique', 1831, 0),
(11, 'Les Fleurs du mal', 'Charles Baudelaire', 'Poésie', 1857, 0),
(12, 'Une vie', 'Guy de Maupassant', 'Roman', 1883, 0),
(13, 'Candide', 'Voltaire', 'Philosophie', 1759, 0),
(14, 'Le Père Goriot', 'Honoré de Balzac', 'Roman', 1835, 0),
(15, 'Le Dernier Jour d’un Condamné', 'Victor Hugo', 'Roman engagé', 1829, 0),
(16, 'Madame Bovary', 'Gustave Flaubert', 'Roman réaliste', 2025, 0);

-- --------------------------------------------------------

--
-- Structure de la table `pret`
--

CREATE TABLE `pret` (
  `id_pret` int(11) NOT NULL,
  `date_pret` date NOT NULL,
  `date_retour_prevue` date NOT NULL,
  `date_retour_effective` date DEFAULT NULL,
  `id_adherent` int(11) DEFAULT NULL,
  `id_livre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pret`
--

INSERT INTO `pret` (`id_pret`, `date_pret`, `date_retour_prevue`, `date_retour_effective`, `id_adherent`, `id_livre`) VALUES
(1, '2025-08-08', '2025-08-09', '2025-08-14', 1, 1),
(2, '2025-08-08', '2025-08-08', '2025-08-14', 2, 2),
(3, '2025-08-08', '2025-08-08', '2025-08-14', 2, 3),
(4, '2025-08-08', '2025-08-08', '2025-08-14', 4, 4),
(5, '2025-08-08', '2025-08-08', '2025-08-14', 3, 5),
(6, '2025-08-08', '2025-08-08', '2025-08-14', 4, 6),
(7, '2025-08-08', '2025-08-08', '2025-08-14', 4, 7),
(8, '2025-08-09', '2025-08-09', '2025-08-14', 4, 8),
(9, '2025-08-11', '2025-08-15', '2025-08-26', 4, 16),
(10, '2025-08-11', '2025-08-11', '2025-08-29', 4, 12),
(11, '2025-08-14', '2025-08-14', '2025-08-29', 4, 1),
(12, '2025-08-17', '2025-08-17', '2025-08-29', 4, 2),
(13, '2025-08-18', '2025-08-18', '2025-08-19', 1, 3),
(14, '2025-08-28', '2025-08-28', NULL, 1, 3),
(15, '2025-08-29', '2025-08-29', NULL, 1, 4),
(16, '2025-08-29', '2025-08-29', NULL, 1, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adherent`
--
ALTER TABLE `adherent`
  ADD PRIMARY KEY (`id_adherent`);

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `livre`
--
ALTER TABLE `livre`
  ADD PRIMARY KEY (`id_livre`);

--
-- Index pour la table `pret`
--
ALTER TABLE `pret`
  ADD PRIMARY KEY (`id_pret`),
  ADD KEY `id_adherent` (`id_adherent`),
  ADD KEY `id_livre` (`id_livre`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adherent`
--
ALTER TABLE `adherent`
  MODIFY `id_adherent` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `livre`
--
ALTER TABLE `livre`
  MODIFY `id_livre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `pret`
--
ALTER TABLE `pret`
  MODIFY `id_pret` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `pret`
--
ALTER TABLE `pret`
  ADD CONSTRAINT `pret_ibfk_1` FOREIGN KEY (`id_adherent`) REFERENCES `adherent` (`id_adherent`),
  ADD CONSTRAINT `pret_ibfk_2` FOREIGN KEY (`id_livre`) REFERENCES `livre` (`id_livre`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

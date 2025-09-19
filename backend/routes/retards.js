const express = require('express');
const router = express.Router();
const db = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Helper functions
function calculateDaysLate(returnDate) {
    const retour = new Date(returnDate);
    const aujourdhui = new Date();
    const diffTime = aujourdhui - retour;
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
// 📌 GET : Liste des livres en retard
router.get('/', async(req, res) => {
    const query = `
    SELECT p.id_pret, l.titre, l.auteur, a.nom, a.prenom, a.id_adherent, 
           a.telephone, p.date_pret, p.date_retour_prevue
    FROM pret p
    JOIN livre l ON p.id_livre = l.id_livre
    JOIN adherent a ON p.id_adherent = a.id_adherent
    WHERE p.date_retour_effective IS NULL AND p.date_retour_prevue < CURDATE()
    ORDER BY p.date_retour_prevue ASC
  `;

    try {
        const [rows] = await db.query(query); // ✅ Correction ici
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('Erreur DB:', err);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Fonction commune de génération PDF
async function generatePdf(res, retards, options) {
    // Configuration PDF
    const doc = new PDFDocument({
        size: options.orientation === 'landscape' ? 'A4 landscape' : 'A4',
        margin: 40,
        info: {
            Title: options.title || 'Liste des livres en retard',
            Author: 'Bibliothèque'
        }
    });

    // En-têtes de réponse
    res.setHeader('Content-Disposition', `attachment; filename="livres_retard_${new Date().toISOString().slice(0,10)}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    // Styles
    const primaryColor = '#24292f';
    const secondaryColor = '#656d76';
    const borderColor = '#d0d7de';
    const headerBgColor = '#f6f8fa';
    const rowBgColor = '#f8f9fa';

    // En-tête du document
    doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(primaryColor)
        .text(options.title || 'Liste des livres en retard', { align: 'center' });

    doc.moveDown(0.5);
    doc.font('Helvetica')
        .fontSize(12)
        .fillColor(secondaryColor)
        .text(options.subtitle || `Généré le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });

    doc.moveDown(1.5);

    // Tableau des retards
    const tableTop = doc.y;
    const colWidths = [30, 150, 120, options.includeContacts ? 120 : 0, 80, 80, 70].filter(w => w > 0);
    const totalWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = (doc.page.width - totalWidth) / 2;

    // En-tête du tableau
    doc.font('Helvetica-Bold')
        .fontSize(10)
        .fillColor(secondaryColor)
        .rect(startX, tableTop, totalWidth, 20)
        .fill(headerBgColor);

    const headers = ['#', 'Titre', 'Adhérent', ...(options.includeContacts ? ['Contact'] : []), 'Date prêt', 'Retour prévu', 'Retard'];
    headers.forEach((header, i) => {
        doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, tableTop + 5, {
            width: colWidths[i] - 10,
            align: 'left'
        });
    });

    // Lignes de données
    doc.font('Helvetica')
        .fontSize(10);

    retards.forEach((retard, index) => {
        const rowY = tableTop + 25 + (index * 25);
        const daysLate = calculateDaysLate(retard.date_retour_prevue);

        // Couleur en fonction du retard
        let retardColor = primaryColor;
        if (daysLate > 14) retardColor = '#cf222e';
        else if (daysLate > 7) retardColor = '#9a6700';
        else if (daysLate > 3) retardColor = '#bf8700';

        // Fond alterné pour les lignes
        if (index % 2 === 0) {
            doc.rect(startX, rowY - 5, totalWidth, 25)
                .fill(rowBgColor);
        }

        // Numéro
        doc.fillColor(primaryColor)
            .text((index + 1).toString(), startX + 5, rowY, { width: colWidths[0] - 10, align: 'left' });

        // Titre et auteur
        doc.text(retard.titre, startX + colWidths[0] + 5, rowY, { width: colWidths[1] - 10, align: 'left' });
        doc.font('Helvetica-Oblique')
            .fontSize(8)
            .fillColor(secondaryColor)
            .text(retard.auteur, startX + colWidths[0] + 5, rowY + 12, { width: colWidths[1] - 10, align: 'left' })
            .font('Helvetica')
            .fillColor(primaryColor);

        // Adhérent
        doc.text(`${retard.prenom} ${retard.nom}`, startX + colWidths[0] + colWidths[1] + 5, rowY, { width: colWidths[2] - 10, align: 'left' });
        doc.fontSize(8)
            .fillColor(secondaryColor)
            .text(`ID: ${retard.id_adherent}`, startX + colWidths[0] + colWidths[1] + 5, rowY + 12, { width: colWidths[2] - 10, align: 'left' })
            .fontSize(10)
            .fillColor(primaryColor);

        // Contact (si activé)
        if (options.includeContacts) {
            const contactX = startX + colWidths[0] + colWidths[1] + colWidths[2] + 5;
            doc.text(retard.telephone ? retard.telephone.replace(/(\d{2})(?=\d)/g, '$1 ') : '', contactX, rowY, { width: colWidths[3] - 10, align: 'left' });
            doc.fontSize(8)
                .text(retard.email || '', contactX, rowY + 12, { width: colWidths[3] - 10, align: 'left' })
                .fontSize(10);
        }

        // Dates et retard
        const dateOffset = options.includeContacts ? 4 : 3;
        const dateX = startX + colWidths.slice(0, dateOffset).reduce((a, b) => a + b, 0) + 5;

        doc.fillColor(primaryColor)
            .text(formatDate(retard.date_pret), dateX, rowY, { width: colWidths[dateOffset] - 10, align: 'left' })
            .text(formatDate(retard.date_retour_prevue), dateX + colWidths[dateOffset] + 5, rowY, { width: colWidths[dateOffset + 1] - 10, align: 'left' })
            .fillColor(retardColor)
            .text(`${daysLate} jours`, dateX + colWidths[dateOffset] + colWidths[dateOffset + 1] + 5, rowY, { width: colWidths[dateOffset + 2] - 10, align: 'left' });
    });

    // Bordure du tableau
    doc.rect(startX, tableTop, totalWidth, 25 + retards.length * 25)
        .stroke(borderColor);

    // Pied de page avec statistiques si activé
    if (options.includeStats && retards.length > 0) {
        doc.moveDown(2);
        doc.font('Helvetica-Bold')
            .fillColor(primaryColor)
            .text('Résumé statistique:', { align: 'left' });

        const totalRetards = retards.length;
        const avgDelay = retards.reduce((sum, r) => sum + calculateDaysLate(r.date_retour_prevue), 0) / totalRetards;
        const maxDelay = Math.max(...retards.map(r => calculateDaysLate(r.date_retour_prevue)));

        doc.font('Helvetica')
            .text(`• Total des retards: ${totalRetards}`, { align: 'left', indent: 20 })
            .text(`• Retard moyen: ${avgDelay.toFixed(1)} jours`, { align: 'left', indent: 20 })
            .text(`• Retard maximum: ${maxDelay} jours`, { align: 'left', indent: 20 });
    }

    doc.end();
}

// 📄 POST : Génération PDF des retards avec options (recommandé)
router.post('/pdf', async(req, res) => {
    try {
        const { retards, options } = req.body;
        if (!retards || !options) {
            return res.status(400).json({ success: false, message: 'Paramètres manquants' });
        }
        await generatePdf(res, retards, options);
    } catch (err) {
        console.error('Erreur génération PDF:', err);
        res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF' });
    }
});

// 📄 GET : Alternative pour génération PDF (avec paramètres query)
router.get('/pdf', async(req, res) => {
    try {
        const { retards: retardsParam, options: optionsParam } = req.query;

        if (!retardsParam || !optionsParam) {
            return res.status(400).json({ success: false, message: 'Paramètres manquants dans l\'URL' });
        }

        const retards = JSON.parse(retardsParam);
        const options = JSON.parse(optionsParam);

        await generatePdf(res, retards, options);
    } catch (err) {
        console.error('Erreur génération PDF:', err);
        res.status(500).json({ success: false, message: 'Erreur lors de la génération du PDF' });
    }
});
// 📩 POST : Envoi des rappels pour les retards
router.post('/rappel', async(req, res) => {
    try {
        const { retards } = req.body;

        if (!retards || !Array.isArray(retards)) {
            return res.status(400).json({ success: false, message: 'Liste de retards invalide' });
        }

        // Ici vous devriez implémenter la logique d'envoi des rappels
        // Par exemple: envoi d'emails ou SMS aux adhérents

        // Simulation de succès
        res.json({
            success: true,
            message: `${retards.length} rappels envoyés avec succès`,
            data: retards.map(r => ({
                id: r.id_pret,
                adherent: `${r.prenom} ${r.nom}`,
                telephone: r.telephone,
                livre: r.titre
            }))
        });

    } catch (err) {
        console.error('Erreur envoi rappels:', err);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi des rappels',
            error: err.message
        });
    }
});

module.exports = router;
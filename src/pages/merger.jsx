import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFPreview = ({ file }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
      <Page pageNumber={1} width={200} />
    </Document>
  );
};

const Merger = () => {
  const location = useLocation();
  const selectedFiles = location.state?.files
    ? Array.from(location.state.files)
    : [];
  const [draggedItem, setDraggedItem] = useState(null);
  const [cards, setCards] = useState(selectedFiles);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const newCards = [...cards];
    const draggedCard = newCards[draggedItem];
    newCards.splice(draggedItem, 1);
    newCards.splice(index, 0, draggedCard);
    setCards(newCards);
    setDraggedItem(index);
  };

  const handleDrop = () => {
    setDraggedItem(null);
  };

  const handleMergePDF = async () => {
    const combinedPdf = await PDFDocument.create();

    for (const file of cards) {
      const fileData = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileData);
      const pages = await combinedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => combinedPdf.addPage(page));
    }

    const mergedPdfFile = await combinedPdf.save();
    const blob = new Blob([mergedPdfFile], { type: "application/pdf" });

    // Crear un enlace para descargar el PDF combinado
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "combined.pdf";
    link.click();

    // Limpiar el objeto URL
    URL.revokeObjectURL(link.href);
  };

  const handleAddDocuments = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "application/pdf";

    input.onchange = (e) => {
      const files = e.target.files;
      if (files) {
        const newFiles = Array.from(files);
        setCards(cards.concat(newFiles));
      }
    };

    input.click();
  };

  const handleDeleteDocument = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <>
      <Box sx={{ px: 3, pt: 3 }}>
        <Typography variant="h4" gutterBottom>
          PDF Merge Organizer
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Arrange the order of your PDF documents by dragging them. Once they
          are in the desired order, merge the documents into a single PDF file.
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={handleMergePDF}
            sx={{
              color: "white",
              width: "30%",
              mr: 2,
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Merge PDF
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={handleAddDocuments}
            sx={{
              color: "white",
              width: "30%",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Add Documents
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, m: 3, width: "auto", maxWidth: "100%" }}>
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          alignItems="stretch"
        >
          {cards.map((file, index) => (
            <Grid
              item
              key={index}
              sm={6}
              md={4}
              lg={3}
              xl={2}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onDragEnter={(e) => handleDragOver(e, index)}
              style={{ position: "relative" }}
            >
              <Card
                raised
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 220,
                  minHeight: 300,
                  height: 300,
                  borderRadius: 5,
                  opacity: draggedItem === index ? 0.5 : 1,
                  cursor: "grab",
                  "&:hover .delete-icon": {
                    // Mostrar el botón al hacer hover
                    opacity: 1,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <PDFPreview file={file} />
                  </Box>
                  <Tooltip title="Delete document" placement="top">
                    <IconButton
                      className="delete-icon"
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        opacity: 0, // Ocultar por defecto
                        transition: "opacity 0.3s",
                      }}
                      onClick={() => handleDeleteDocument(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Merger;

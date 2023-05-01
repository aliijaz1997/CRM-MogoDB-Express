import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Grid, IconButton, InputAdornment } from "@mui/material";
import { Backspace, Call } from "@mui/icons-material";
import { styled } from "@mui/styles";
import { validatePhoneNumber } from "../../helper/phoneValidation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export default function DialDialog(props: Props) {
  const { isOpen, onClose } = props;
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNumberButtonClick = (number: number) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(phoneNumber + number);
    }
  };

  const handleCallButtonClick = () => {
    if (phoneNumber.length === 11 && validatePhoneNumber(phoneNumber)) {
      console.log(`Dialing ${phoneNumber}...`);
    }
  };

  const handleBackspaceClick = () => {
    setPhoneNumber((prevPhoneNumber) =>
      prevPhoneNumber.substring(0, prevPhoneNumber.length - 1)
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <TextField
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="backspace"
                    onClick={handleBackspaceClick}
                    disabled={!phoneNumber}
                  >
                    <Backspace />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            value={phoneNumber}
            onChange={(event) => {
              if (phoneNumber.length < 11) {
                setPhoneNumber(event.target.value);
              }
            }}
            placeholder="Enter phone number"
            sx={{
              borderRadius: "50px",
              bgcolor: "background.paper",
              "& .MuiInputBase-input": {
                py: 2,
                px: 3,
                fontSize: "24px",
                textAlign: "center",
                color: "text.primary",
              },
            }}
          />
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(1)}>
                1
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(2)}>
                2
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(3)}>
                3
              </NumberButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(4)}>
                4
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(5)}>
                5
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(6)}>
                6
              </NumberButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(7)}>
                7
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(8)}>
                8
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(9)}>
                9
              </NumberButton>
            </Grid>
          </Grid>
          <Grid>
            <Grid item textAlign="center">
              <NumberButton onClick={() => handleNumberButtonClick(0)}>
                0
              </NumberButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justifyContent="center">
            <Grid item>
              <CallButton aria-label="call" onClick={handleCallButtonClick}>
                <Call sx={{ color: "white" }} />
              </CallButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

const NumberButton = styled(Button)({
  borderRadius: "50%",
  width: "64px",
  height: "64px",
  fontSize: "24px",
  fontWeight: "bold",
});

const CallButton = styled(IconButton)({
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  backgroundColor: "#50C878",
  "&:hover": {
    backgroundColor: "#00693E",
  },
  marginBottom: 4,
});

import React, { useEffect, useState } from "react";
import StepperBtn from "./StepperBtn";
import { Avatar, Badge, Box, TextField, styled } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import CameraEnhanceIcon from "@mui/icons-material/CameraEnhance";
import { useProfile } from "../../context/ProfileContext";
import { StyledLabel } from "../../StyledComponents/Styled";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { bucket, db } from "../../services/firebase.config";
import { v4 } from "uuid";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { setToast } from "../../Controllers/Controller";
import Compressor from "compressorjs";
const fileTypes = ["JPG", "PNG", "GIF"];
type Props = {
  handleNext: () => void;
  handleBack: () => void;
  handleReset: () => void;
  activeStep: number;
  steps: string[];
};
const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));
const PictureUpload = ({
  handleNext,
  handleBack,
  handleReset,
  activeStep,
  steps,
}: Props) => {
  const { dp, setDp,bio,setBio } = useProfile();
  const {uid} = useAuth()
  const [file, setFile] = useState<null | File>(null);
  const handleChange = (file: File) => {
    console.log(file)
    if(!file) return
    if(file.size>10000000) {
      setToast("File size should be less than 10MB","error")
      return
    }
   // eslint-disable-next-line no-unused-vars
   const compressor =  new Compressor(file,
      {
        quality:0.6,
        success(result) {
          const compressedFile = new File([result], file.name, { type: result.type });
      setFile(compressedFile);
        },
      })
  };
  useEffect(() => {
    async function upload() {
      if (file) {
        const storageRef = ref(bucket, `Imgs/${v4()}`);
        await uploadBytes(storageRef, file).then((data) => {
          console.log(data);
          getDownloadURL(data.ref).then((url) => {
            setDp(url);
          });
        });
      }
    }
    upload();
  }, [file, setDp]);
  const handleSubmit = () => {
    console.log(bio);
    const docRef = doc(db, "user", uid);
    updateDoc(docRef, { photoURL: dp,timestamp: serverTimestamp(),bio });
    handleNext();
  };
  return (
    <>
      <Box sx={{pt:5}}>
        <StyledLabel>Profile Picture</StyledLabel>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            // eslint-disable-next-line react/no-children-prop
            children={
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <SmallAvatar>
                    <CameraEnhanceIcon
                      sx={{
                        backgroundColor: "white",
                        cursor: "pointer",
                        color: "green",
                      }}
                    />
                  </SmallAvatar>
                }
              >
                <Avatar
                  alt="Travis Howard"
                  src={dp}
                  sx={{ width: 100, height: 100, margin: "auto" }}
                />
              </Badge>
            }
          />
        </Box>
        <Box sx={{pt:5}}>
        <StyledLabel htmlFor="firstName">Add Bio</StyledLabel>

        <TextField multiline minRows={2} maxRows={4} sx={{minWidth:"60%"}} defaultValue={bio} onChange={(event)=>setBio(event.target.value)}/>

        </Box>
      </Box>
      <StepperBtn
        handleSubmit={handleSubmit}
        handleBack={handleBack}
        activeStep={activeStep}
        steps={steps}
      />
    </>
  );
};

export default PictureUpload;

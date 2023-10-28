import React, { useContext, useState } from "react";
import MusicPlayer from "../AudioPlayer/index";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";

var jsmediatags = window.jsmediatags;

const FolderSelection = () => {
  const { updateFolder,updateMetadata } = useContext(MainContext);
  const navigate = useNavigate();

  const selectFolder = async () => {
    try {
      const folderSelected = await window.electron.selectFolder();
      const fs = window.electron.fs;
      const path = window.electron.path;
  
      if (folderSelected) {
        updateFolder(folderSelected);
        localStorage.setItem("selected-folder", folderSelected);
        fs.readdir(folderSelected, (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
          let metadata=[];
          files.forEach((fileName) => {
            const filePath = path.join(folderSelected, fileName);
            fs.readFile(filePath, (err, data) => {
              if (err) {
                // Handle file read error if needed
              } else {
                const file = new File([data], fileName, { type: "audio/mpeg" });
                jsmediatags.read(file, {
                  onSuccess: function (tag) {
                    if(tag.tags){
                      const filedata = {
                        title: tag.tags.title,
                        album: tag.tags.album,
                        artist: tag.tags.artist,
                        picture: tag.tags.picture,
                        path:filePath
                      };
                      metadata.push(filedata)


                    }
                   
                  },
                  onError: function (error) {
                    console.log(":(", error.type, error.info);
                  },
                });
              }
            });
          });
          updateMetadata(metadata)
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <button className={styles.selectButton} onClick={selectFolder}>
        Select Folder <FolderOpenOutlinedIcon />
      </button>
    </div>
  );
};

export default FolderSelection;
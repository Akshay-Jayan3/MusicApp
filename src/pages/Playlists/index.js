import React, { useContext, useState, useEffect } from "react";
import Header from "../../components/Header";
import { MainContext } from "../../context/MainContext";
import Search from "../../components/Search";
import AudioPlayer from "../../components/AudioPlayer";
import AlbumList from "../../components/AlbumList";
import PlaylistSongs from "../../components/Playlist";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import * as cachemanager from "../../cacheStore/index";
import { cacheEntities } from "../../cacheStore/cacheEntities";
import AddPlaylistModal from "../../components/AddplaylistModal";
import LoadingScreen from "../../components/Loader";
import { useLocation } from "react-router-dom";

const Playlists = () => {
  const [songs, setSongs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylist] = useState([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const res = await cachemanager.getSongsFromplaylist(
          cacheEntities.PLAYLISTS,
          cacheEntities.SONGS
        );
        setPlaylist(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchMetaData();
  }, []);

  useEffect(() => {
    setSongs(selectedPlaylist.MusicMetadata);
  }, [selectedPlaylist]);

  const performSearch = (value) => {
    setSearchString(value);
    setFilteredData(
      showPlaylist && songs
        ? songs.filter((item) =>
            item?.title?.toLowerCase().includes(value.toLowerCase())
          )
        : playlists.filter((item) =>
            item?.name?.toLowerCase().includes(value.toLowerCase())
          )
    );
  };

  const HandleSelectPlaylist = () => {
    setShowPlaylist(!showPlaylist);
  };

  const deletePlaylist = (event, PlaylistId) => {
    event.stopPropagation();
    cachemanager
      .deleteEntityById(cacheEntities.PLAYLISTS, PlaylistId)
      .then((res) => {
        setPlaylist((prevTracks) =>
          prevTracks.filter((prevTrack) => prevTrack.id !== PlaylistId)
        );
      })
      .catch((error) => console.error("Error deleting playlist:", error));
  };
  const RemoveFromPlaylist = (e, playlistId, songId) => {
    e.stopPropagation();
    cachemanager
      .removeSongfromPlaylist(
        cacheEntities.PLAYLISTS,
        cacheEntities.SONGS,
        playlistId,
        songId
      )
      .then((res) => {
        handleShowToast();
        setSongs((prevTracks) =>
          prevTracks.filter((prevTrack) => prevTrack.id !== songId)
        );
      });
  };

  return (
    <>
      {isLoading && <LoadingScreen message={"Loading ..."} />}
      <div className="Songspage">
        <div className="mainsection">
          <Search
            showback={showPlaylist}
            HandleBack={HandleSelectPlaylist}
            onChange={performSearch}
            value={searchString}
            placeholder={
              showPlaylist
                ? "Search your favourite Songs"
                : "Search your favourite Playlists"
            }
          />
          <Header
            heading={"Music For You"}
            description={"Listen to your favourite songs"}
          />

          <div className="songs-container">
            {showModal ? (
              <AddPlaylistModal
                closeModal={closeModal}
                setPlaylist={setPlaylist}
              />
            ) : !showPlaylist ? (
              playlists && playlists?.length > 0 ? (
                <>
                  <button className="Addplaylist" onClick={openModal}>
                    <ControlPointOutlinedIcon fontSize="small" />
                    Add New Playlist
                  </button>
                  <AlbumList
                    albums={
                      searchString && searchString !== ""
                        ? filteredData
                        : playlists
                    }
                    HandleFile={HandleSelectPlaylist}
                    HandleSelected={setSelectedPlaylist}
                    HandleAction={deletePlaylist}
                  />
                </>
              ) : (
                !showModal && (
                  <button className="Addplaylist" onClick={openModal}>
                    <ControlPointOutlinedIcon fontSize="small" />
                    Add New Playlist
                  </button>
                )
              )
            ) : (
              <PlaylistSongs
                selectedPlaylist={selectedPlaylist}
                songs={
                  searchString && searchString !== "" ? filteredData : songs
                }
                RemoveFromPlaylist={RemoveFromPlaylist}
                showToast={showToast}
                handleCloseToast={handleCloseToast}
              />
            )}
          </div>
        </div>
        <div className="currentMusic">
          <div className="musicCard">
            <AudioPlayer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Playlists;

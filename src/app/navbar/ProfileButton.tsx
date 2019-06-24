import {
  Divider,
  ListItemIcon,
  ListItemText,
  PropTypes,
  Switch
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Brightness2, Person, PowerSettingsNew } from "@material-ui/icons";
import React, { useContext } from "react";
import { GlobalContext } from "../..";

export const ProfileButton: React.FC<{ color?: PropTypes.Color }> = props => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();
  const { darkMode, setDarkMode } = useContext(GlobalContext);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(undefined);
  }

  function logout() {
    window.location.href = "logout";
  }

  return (
    <>
      <Button color={props.color} onClick={e => handleClick(e)}>
        <Person />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        <MenuItem>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => setDarkMode(!darkMode)}>
          <ListItemIcon>
            <Brightness2 />
          </ListItemIcon>
          <ListItemText primary="Dark Mode" />
          <Switch checked={darkMode} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <PowerSettingsNew />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
};

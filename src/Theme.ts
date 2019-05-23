import { createMuiTheme } from "@material-ui/core/styles"

export const DefaultTheme = createMuiTheme({})

export const DarkTheme = createMuiTheme({
    palette: {
        type: "dark",
        text: {
            primary: "#ebfff0",
            secondary: "#8e9297"
        },
        background: {
            default: "#36393f",
            paper: "#2f3136"
        }
    }
})

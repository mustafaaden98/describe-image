// filepath: d:\describe-image\client\src\components\Header.tsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from "../assets/logo.png";
import { Box } from '@mui/material';

export default function Header() {
    return (
        <AppBar >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={Logo}
                    alt="logo"
                    style={{
                        height: 72,
                        maxHeight: 72,
                        width: 'auto',
                        maxWidth: 160,
                        objectFit: 'contain',
                        marginRight: 12,
                    }}
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Describe Image
                </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
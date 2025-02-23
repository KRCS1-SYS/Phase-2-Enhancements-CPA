import { 
    Box, 
    Typography,
    Divider 
 } from "@mui/material"

const Section = ({title}) => {
    return(
            <Box sx={{display: "flex", alignItems: "center", }} mb={2} mt={4} >
                 
                 <Typography color="primary.main"  variant="h2" fontWeight={600}  sx={{ mx: 2, whiteSpace: 'nowrap'}}>
                     {title}
                     <Divider />
                 </Typography>
            </Box>
    )
}

export {
    Section
}



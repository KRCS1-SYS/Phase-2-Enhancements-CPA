import { Avatar, Button, Typography, Stack, Box} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import { Link as routeLink} from "react-router-dom";

const StateButton = ({ title, state }) => {
    return (
        <Button component={routeLink} 
        to={`/state/${title.toLowerCase()}/${state}`}   
        border={5} 
        borderColor="black" 
        disableElevation 
        sx={{ border: 1, borderColor: 'primary.main',  borderRadius: 2,  }} 
  >
        {state === "Ideal" && (
            <>
                <CheckIcon color={'success'}/>  
                <Typography ml={.5}>
                    Ideal
                </Typography>         
            </>

        )}  
        {state === "Critical" && (
            <>
                <WarningIcon color={'error'}/>  
                  <Typography ml={.5}>
                      Critical
                </Typography>
            </>

        )}
        {state === "Caution" && (
            <>
                <WarningIcon color={'warning'}/>  
                  <Typography ml={.5}>
                      Caution
                </Typography>           
            </>

        )}        
</Button>
    )
}

export {
    StateButton
}
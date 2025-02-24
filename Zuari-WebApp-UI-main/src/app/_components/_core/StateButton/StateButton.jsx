import { Avatar, Button, Typography, Stack, Box} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import { Link as routeLink} from "react-router-dom";
import { CircularProgress } from "@mui/material";
 import { StateListLoader } from "@app/_components/StateList/StateListLoader/StateListLoader";

// import { MoonLoader } from "react-spinners";
const StateButton = ({ title, state, count='' }) => {
     
    return (
        <Button component={routeLink} 
        to={`/state/${title.toLowerCase()}/${state}`}   
        border={5} 
        borderColor="black" 
        disableElevation 
        sx={{ border: 1, borderColor: 'primary.main',  borderRadius: 2,  }} 
  >
        {/* {state === "Ideal" && ( */}
            <>
            {(state === "Ideal") ? <CheckIcon color={'success'}/>: <WarningIcon color={(state=='Critical') ?'error': 'warning'}/>}
                  
                <Typography ml={.5}>
                    {/* Ideal  */}
                    {state} 
                    {(count=='') ? <>
                    <CircularProgress size={15}/>
                    </>: <Typography sx={{ mt: 0 }} >{count} </Typography>}
                </Typography>         
            </>

        {/* )}   */}
        {/* {state === "Critical" && (
            <>
                <WarningIcon color={'error'}/>  
                  <Typography ml={.5}>
                      Critical 
                      {(count=='') ? <StateListLoader />: {count}}
                </Typography>
            </>

        )}
        {state === "Caution" && (
            <>
                <WarningIcon color={'warning'}/>  
                  <Typography ml={.5}>
                      Caution {(count=='') ? <StateListLoader />: {count}}
                </Typography>           
            </>

        )}         */}
</Button>
    )
}

export {
    StateButton
}
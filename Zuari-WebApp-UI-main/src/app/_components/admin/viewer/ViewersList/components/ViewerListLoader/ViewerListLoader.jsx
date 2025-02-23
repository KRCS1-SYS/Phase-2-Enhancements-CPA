import React from "react"
import ContentLoader from "react-content-loader"
import { useSmallScreen } from "@app/_hooks/index";

const ViewerListLoader = (props) => {
  const smallScreen = useSmallScreen();
  const loading = false;

  if(smallScreen)
      return <ContentLoader
        speed={1}
        width={"100%"}
        height={"100%"}
        viewBox="0 0 200 1000"
        backgroundColor="#d9d9d9"
        foregroundColor="#ecebeb"
        preserveAspectRatio="xMidYMid meet"
        {...props}
      > 
        <rect x="10" y="1" rx="3" ry="5" width="65" height="19" />
        <rect x="150" y="1" rx="3" ry="5" width="50" height="19" />
        <rect x="10" y="25" rx="3" ry="5" width="190" height="19" />

        {/* <rect x="10" y="60" rx="3" ry="15" width="15" height="15" /> */}
        <rect x="10" y="55" rx="3" ry="5" width="110" height="29" />
        <rect x="150" y="55" rx="3" ry="5" width="50" height="29" />

        <rect x="10" y="100" rx="3" ry="15" width="110" height="29" />
        <rect x="150" y="100" rx="3" ry="5" width="50" height="29" />

        <rect x="10" y="140" rx="3" ry="15" width="110" height="29" />
        <rect x="150" y="140" rx="3" ry="5" width="50" height="29" />

        <rect x="10" y="180" rx="3" ry="15" width="110" height="29" />
        <rect x="150" y="180" rx="3" ry="5" width="50" height="29" />

        <rect x="10" y="220" rx="3" ry="15" width="110" height="29" />
        <rect x="150" y="220" rx="3" ry="5" width="50" height="29" />

        <rect x="10" y="260" rx="3" ry="15" width="110" height="29" />
        <rect x="150" y="260" rx="3" ry="5" width="50" height="29" />

        <rect x="10" y="300" rx="3" ry="15" width="110" height="29" />
        <rect x="150" y="300" rx="3" ry="5" width="50" height="29" />
    </ContentLoader>


  return (
    <ContentLoader 
      speed={1}
      width={"100%"}
      height={"100%"}
      viewBox="0 -15 650 1000"
      backgroundColor="#d9d9d9"
      foregroundColor="#ecebeb"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >    
 
    {!(smallScreen) && 
      <> 
        <rect x="1%" y="0%" rx=".4%" ry=".4%" width="10%" height="2%" />
        <rect x="86%" y="0%" rx=".4%" ry=".4%" width="10%" height="2%" />
        <rect x="1%" y="2.5%" rx=".4%" ry=".4%" width="95%" height="1.7%" />


        <rect x="1%" y="5%" rx=".4%" ry=".4%" width="25%" height="2%"/>
        <rect x="50%" y="5%" rx=".4%" ry=".4%" width="15%" height="2%" />
        <rect x="92%" y="5%" rx=".4%" ry=".4%" width="4%" height="2%"/>

        <rect x="1%" y="7.5%" rx=".4%" ry=".4%" width="25%" height="2%"/>
        <rect x="50%" y="7.5%" rx=".4%" ry=".4%" width="15%" height="2%" />
        <rect x="92%" y="7.5%" rx=".4%" ry=".4%" width="4%" height="2%"/>

        <rect x="1%" y="10%" rx=".4%" ry=".4%" width="25%" height="2%"/>
        <rect x="50%" y="10%" rx=".4%" ry=".4%" width="15%" height="2%" />
        <rect x="92%" y="10%" rx=".4%" ry=".4%" width="4%" height="2%"/>

        <rect x="1%" y="12.5%" rx=".4%" ry=".4%" width="25%" height="2%"/>
        <rect x="50%" y="12.5%" rx=".4%" ry=".4%" width="15%" height="2%" />
        <rect x="92%" y="12.5%" rx=".4%" ry=".4%" width="4%" height="2%"/>

        <rect x="1%" y="15%" rx=".4%" ry=".4%" width="25%" height="2%"/>
        <rect x="50%" y="15%" rx=".4%" ry=".4%" width="15%" height="2%" />
        <rect x="92%" y="15%" rx=".4%" ry=".4%" width="4%" height="2%"/>

     
      </>
    }
    
    
    </ContentLoader>
  )
}

export {ViewerListLoader};
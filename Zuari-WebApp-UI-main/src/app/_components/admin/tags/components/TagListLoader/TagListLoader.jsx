import React from "react"
import ContentLoader from "react-content-loader"
import { Div } from "@jumbo/shared/Div/Div";
import { useSmallScreen } from "@app/_hooks";

const TagListLoader = (props) => {
  const smallScreen = useSmallScreen();

  if(smallScreen)
      return <ContentLoader
        speed={4}
        width={"100%"}
        height={"100%"}
        viewBox="0 0 200 1000"
        backgroundColor="#d9d9d9"
        foregroundColor="#ecebeb"
        preserveAspectRatio="xMidYMid meet"
        {...props}
      > 
        <rect x="10" y="1" rx="3" ry="5" width="65" height="19" />%
        <rect x="10" y="25" rx="3" ry="5" width="180" height="19" />

        <rect x="10" y="60" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="55" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="60" rx="3" ry="5" width="50" height="19" />

        <rect x="10" y="100" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="95" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="100" rx="3" ry="5" width="50" height="19" />

        <rect x="10" y="140" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="135" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="140" rx="3" ry="5" width="50" height="19" />

        <rect x="10" y="180" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="175" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="180" rx="3" ry="5" width="50" height="19" />

        <rect x="10" y="220" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="215" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="220" rx="3" ry="5" width="50" height="19" />

        <rect x="10" y="260" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="255" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="260" rx="3" ry="5" width="50" height="19" />

        <rect x="10" y="300" rx="3" ry="15" width="15" height="15" />
        <rect x="60" y="295" rx="3" ry="5" width="55" height="29" />
        <rect x="150" y="300" rx="3" ry="5" width="50" height="19" />
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
        <rect x="1%" y="0%" rx="0.4%" ry=".1%" width="11%" height="2%" />
        <rect x="1%" y="2.5%" rx="0.4%" ry=".1%" width="95%" height="1.5%" />

        <rect x="1%" y="5%" rx=".4%" ry=".1%" width="4%" height="2%" />
        <rect x="16%" y="5%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="43%" y="5%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="70%" y="5%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="92.5%" y="5%" rx="5" ry="4" width="4%" height="2%"/>

        <rect x="1%" y="8%" rx=".4%" ry=".1%" width="4%" height="2%" />
        <rect x="16%" y="8%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="43%" y="8%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="70%" y="8%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="92.5%" y="8%" rx="5" ry="4" width="4%" height="2%"/>

        <rect x="1%" y="11%" rx=".4%" ry=".1%" width="4%" height="2%" />
        <rect x="16%" y="11%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="43%" y="11%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="70%" y="11%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="92.5%" y="11%" rx="5" ry="4" width="4%" height="2%"/>
        
        <rect x="1%" y="14%" rx=".4%" ry=".1%" width="4%" height="2%" />
        <rect x="16%" y="14%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="43%" y="14%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="70%" y="14%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="92.5%" y="14%" rx="5" ry="4" width="4%" height="2%"/>
        
        <rect x="1%" y="17%" rx=".4%" ry=".1%" width="4%" height="2%" />
        <rect x="16%" y="17%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="43%" y="17%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="70%" y="17%" rx=".4%" ry=".1%" width="10%" height="2%" />
        <rect x="92.5%" y="17%" rx="5" ry="4" width="4%" height="2%"/>

      </>
    }
    
    
    </ContentLoader>
  )
}

export { TagListLoader };
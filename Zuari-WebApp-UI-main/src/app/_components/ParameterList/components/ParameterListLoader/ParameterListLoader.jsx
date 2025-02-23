import React from "react"
import ContentLoader from "react-content-loader"
import { Div } from "@jumbo/shared/Div/Div";
import { useSmallScreen } from "@app/_hooks";

const ParameterListLoader = (props) => {
  const smallScreen = useSmallScreen();

  if(smallScreen)
  return <ContentLoader
    speed={1}
    width={"100%"}
    viewBox="0 0 100 30"
    backgroundColor="#d9d9d9"
    foregroundColor="#ecebeb"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  > 
      <rect x="8%" y="10.5%" rx=".4%" ry=".4%" width="35%" height="38%" />
      <rect x="68%" y="10.5%" rx=".4%" ry=".4%" width="25%" height="38%"/>
  
</ContentLoader>

   return (
    <ContentLoader 
      speed={1}
      width={"100%"}
      viewBox="0 0 100 10"
      backgroundColor="#d9d9d9"
      foregroundColor="#ecebeb"
      {...props}
    >  
    {!(smallScreen) && 
    <>
      <rect x="1%" y="5.5%" rx=".4%" ry=".4%" width="10%" height="25%" />
      <rect x="34%" y="5.5%" rx=".4%" ry=".4%" width="10%" height="25%"/>
      <rect x="77%" y="5.5%" rx=".4%" ry=".4%" width="10%" height="25%" />

      <rect x="1%" y="44%" rx=".4%" ry=".4%" width="10%" height="25%" />
      <rect x="34%" y="44%" rx=".4%" ry=".4%" width="10%" height="25%"/>
      <rect x="77%" y="44%" rx=".4%" ry=".4%" width="10%" height="25%" />
      </>
    }
    </ContentLoader>
   )

}
 
export { ParameterListLoader };
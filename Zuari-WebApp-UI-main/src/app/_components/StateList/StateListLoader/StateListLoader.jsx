import React from "react"
import ContentLoader from "react-content-loader"
import { Div } from "@jumbo/shared/Div/Div";
import { useSmallScreen } from "@app/_hooks";


const StateListLoader = (props) => {
  const smallScreen = useSmallScreen();

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
    <rect x="10" y="0" rx="3" ry="5" width="190" height="19" />
    <rect x="150" y="25" rx="3" ry="5" width="110" height="29" />
    <rect x="10" y="25" rx="3" ry="5" width="50" height="29" />

    <rect x="10" y="60" rx="3" ry="15" width="15" height="15" />
    <rect x="10" y="60" rx="3" ry="5" width="110" height="29" />
    <rect x="150" y="60" rx="3" ry="5" width="50" height="29" />

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
      speed={8}
      width={"100%"}
      viewBox="0 0 100 10"
      backgroundColor="#d9d9d9"
      foregroundColor="#ecebeb"

      {...props}
    >  

     <rect x="1%" y="2.5%" rx=".4%" ry=".4%" width="10%" height="25%" />
      <rect x="34%" y="2.5%" rx=".4%" ry=".4%" width="10%" height="25%"/>
      <rect x="77%" y="2.5%" rx=".4%" ry=".4%" width="10%" height="25%" />

      <rect x="1%" y="40%" rx=".4%" ry=".4%" width="10%" height="25%" />
      <rect x="34%" y="40%" rx=".4%" ry=".4%" width="10%" height="25%"/>
      <rect x="77%" y="40%" rx=".4%" ry=".4%" width="10%" height="25%" />

      <rect x="1%" y="72%" rx=".4%" ry=".4%" width="10%" height="25%" />
      <rect x="34%" y="72%" rx=".4%" ry=".4%" width="10%" height="25%"/>
      <rect x="77%" y="72%" rx=".4%" ry=".4%" width="10%" height="25%" />
    </ContentLoader>
   )
}

export { StateListLoader };
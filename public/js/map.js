
    mapboxgl.accessToken =mapToken ;
  //  let mapToken=MAP_TOKEN;
  //  console.log(mapToken);
   
     const map = new mapboxgl.Map({
         container: "map", // container ID
         style:"mapbox://styles/mapbox/streets-v12",//dark-v11//outdoors-v12//light-v11
       //  center: coordinates,  [77.2088, 28.6139 ] starting position [lng, lat]. Note that lat must be set between -90 and 90
          center:listing.geometry.coordinates, 
       zoom: 9 // starting zoom
     });
  
  // console.log(coordinates);

     const marker=new mapboxgl.Marker({color:"red"})
          .setLngLat(listing.geometry.coordinates)
// coordinates //  [12.554729,55.70651]listing geometry coordinates
                         //listing.location
          .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
            `<h1>${listing.title}</h1><p>exact location given later</p>`
          
          )
        )
          // .setMaxWidth("300px")
           
          .addTo(map);



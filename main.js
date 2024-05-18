let map,orignAutocomplete,destinationAutocomplete,currentDevice,submitedData={},sendRequest=[];const translationsObject={EN:{TABS:{ROUTE:{HEADLINE:"Book a journey",TYPE_ROW:{TRANSFER_RIDE:"Transfer ride",PER_HOUR:"Per Hour"},ORIGIN:"Origin",DESTINATION:"Destination",FLIGHT_NUMBER:"Flight number",RETURN_DRIVE_SELECT:{LABEL:"Return Drive",ONE_WAY:"One Way",ROUND_TRIP:"Round trip"},HOURS_SELECT:{LABEL:"Hours",INCLUSIVE:"Incl."},CARS:{LABEL:"Car",PLEASE_SELECT:"Please select"},SUBMIT_BUTTON:"Calculate Price"},TRIP:{HEADLINE:"Your Journey",DISTANCE:"Distance",DURATION:"Duration",PRICE:"Price",NAME:"Name",EMAIL:"E-Mail",PHONE:"Phone",BAGGAGE:"Baggage",PERSON:"Person",PERSONS:"Persons",CHILDREN:"Children",DATE:"Date",TIME:"Time",PICKUP_TIME:"Pickup time",COMMENT:"Comment",SUBMIT_BUTTON:"Make Request"},REQUEST:{HEADLINE:"Thank You",YOUR_BOOKING_REQUEST:"Your Booking Request",BOOKING_CLASS:"Booking class",BOOKING_TYPE:"Booking type",WE_WILL_CONTACT_YOU:"We will get in touch with you shortly.",SUBMIT_BUTTON:"Book again"}},EMAILS:{CONFIRMATION:{SUBJECT:"Booking Confirmation",TEXT:"Thank you for your booking request. We will get in touch with you shortly."}},ERRORS:{VEHICLE_CAPACITY:"Vehicle capacity exceeded!",BOOKING_DATETIME:"Invalid booking date and time!",UNKNOWN:{SOMETHING_WENT_WRONG:"Something went wrong!",REQUEST_COULD_NOT_SUBMITED:"Your Request could not submited.",PLEASE_CONTACT_US:"Please contact us directly at info@luxuryride.ch"}}},DE:{TABS:{ROUTE:{HEADLINE:"Reise buchen",TYPE_ROW:{TRANSFER_RIDE:"Transferfahrt",PER_HOUR:"Pro Stunde"},ORIGIN:"Abholort",DESTINATION:"Zielort",FLIGHT_NUMBER:"Flugnummer",RETURN_DRIVE_SELECT:{LABEL:"Rückfahrt",ONE_WAY:"Nur Hinfahrt",ROUND_TRIP:"Hin- & Rückfahrt"},HOURS_SELECT:{LABEL:"Stunden",INCLUSIVE:"Inkl."},CARS:{LABEL:"Fahrzeug",PLEASE_SELECT:"Bitte wählen"},SUBMIT_BUTTON:"Preis berechnen"},TRIP:{HEADLINE:"Ihre Reise",DISTANCE:"Reisestrecke",DURATION:"Reisedauer",PRICE:"Preis",NAME:"Name",EMAIL:"E-Mail",PHONE:"Telefon",BAGGAGE:"Gepäck",PERSON:"Person",PERSONS:"Personen",CHILDREN:"Kinder",DATE:"Datum",TIME:"Zeit",PICKUP_TIME:"Abholzeit",COMMENT:"Bemerkung",SUBMIT_BUTTON:"Anfragen"},REQUEST:{HEADLINE:"Besten Dank!",YOUR_BOOKING_REQUEST:"Ihre Buchungsanfrage",BOOKING_CLASS:"Buchungsklasse",BOOKING_TYPE:"Buchungstyp",WE_WILL_CONTACT_YOU:"Wir werden uns in kürze bei Ihnen melden.",SUBMIT_BUTTON:"Erneut buchen"}},EMAILS:{CONFIRMATION:{SUBJECT:"Buchungsbestätigung // Luxury-Ride",TEXT:"Vielen Dank für Ihre Buchungsanfrage. Wir werden uns in kürze bei Ihnen melden."}},ERRORS:{VEHICLE_CAPACITY:"Ihre ausgewählte Personenanzahl (inkl. Kinder) überschreitet die zulässige Anzahl für das von Ihnen gewählte Fahrzeug.",BOOKING_DATETIME:"Bitte beachten Sie, dass Fahrten mindestens 12h im vornherein gebucht werden können.",UNKNOWN:{SOMETHING_WENT_WRONG:"Irgendwas ist schief gelaufen!",REQUEST_COULD_NOT_SUBMITED:"Ihre Anfrage konnte nicht Übermittelt werden.",PLEASE_CONTACT_US:"Bitte kontaktieren sie uns direkt unter info@luxuryride.ch"}}}};function getLanguageFromUrl(){const e=window.location.href,t=new URL(e),{pathname:n}=t,o=n.split("/")[1].toLowerCase();return["en","de"].includes(o)?o.toUpperCase():"DE"}const languageCode=getLanguageFromUrl(),textTranslations=translationsObject[languageCode];function initMap(){map=new google.maps.Map(document.getElementById("map"),{mapId:"DEMO_MAP_ID",zoom:11,center:{lat:47.34002,lng:8.58162},disableDefaultUI:!0,draggable:!1,clickable:!1});const e=new google.maps.StyledMapType([{elementType:"geometry",stylers:[{color:"#000000"}]},{elementType:"labels.text.stroke",stylers:[{color:"#242f3e"}]},{elementType:"labels.text.fill",stylers:[{color:"#746855"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#263c3f"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#6b9a76"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#38414e"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#212a37"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#9ca5b3"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#746855"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#1f2835"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#f3d19c"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#2f3948"}]},{featureType:"transit.station",elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#2270DE"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#cae1ff"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{color:"#1e90ff"}]}],{name:"Custom Map"});map.mapTypes.set("custom_map",e),map.setMapTypeId("custom_map"),initAutocomplete()}function initAutocomplete(){const e=document.getElementsByName("origin")[0],t=document.getElementsByName("destination")[0],n={componentRestrictions:{country:["de","at","ch"]},strictBounds:!1};orignAutocomplete=new google.maps.places.Autocomplete(e,n),destinationAutocomplete=new google.maps.places.Autocomplete(t,n),orignAutocomplete.addListener("place_changed",(()=>{const t=orignAutocomplete.getPlace().types.includes("airport");e.setAttribute("airport",t)})),destinationAutocomplete.addListener("place_changed",(()=>{const e=destinationAutocomplete.getPlace().types.includes("airport");t.setAttribute("airport",e)}))}function switchTab(e){const t="invisible";"route"==e?document.getElementById("trip").classList.toggle(t):"trip"==e?("Mobile"==currentDevice?(document.getElementById("map").style.display="flex",document.getElementsByClassName("route-form-container")[0].style.height="750px"):"Tablet"==currentDevice&&(document.getElementById("map").style.display="flex",document.getElementsByClassName("route-form-container")[0].style.height="700px"),document.getElementById("route").classList.toggle(t)):(document.getElementById("trip").classList.add(t),document.getElementById("route").classList.add(t)),document.getElementById(e).classList.toggle(t)}function initForm(){var e=document.getElementById("route-form");document.getElementById("cars").addEventListener("change",carsSelectChange),e.addEventListener("submit",(async function(t){if(t.preventDefault(),validateRouteForm()){let t="false";"true"!=e.elements.origin.getAttribute("airport")&&"true"!=e.elements.destination.getAttribute("airport")||(t="true");const o={dataSource:"route",type:e.elements.type.value,origin:e.elements.origin.value,destination:e.elements.destination.value,airport:t,flightNumber:e.elements.flightNumber.value,returnDrive:e.elements["return-drive"].value,hours:e.elements["hours-select"].value,car:e.elements.cars.value};submitedData.route=o;const a=JSON.stringify(o);document.getElementById("loading").style.display="block";const l=await submitRouteForm(a);if("route"==l.dataSource){const{distance:t,duration:o,startLocation:a,endLocation:r,polylines:s,bounds:i,price:m}=l;if(submitedData.distance=t,submitedData.duration=o,submitedData.price=m,submitedData.polylines=s,submitedData.bounds=i,textTranslations&&textTranslations.TABS&&textTranslations.TABS.TRIP&&textTranslations.TABS.TRIP.DISTANCE?(document.getElementById("distance").innerHTML=textTranslations.TABS.TRIP.DISTANCE+": <br>"+t+" Km",document.getElementById("duration").innerHTML=textTranslations.TABS.TRIP.DURATION+": <br>"+o,document.getElementById("price").innerHTML=textTranslations.TABS.TRIP.PRICE+": <br>"+m+" CHF"):(document.getElementById("distance").innerHTML="Distance: <br>"+t+" Km",document.getElementById("duration").innerHTML="Duration: <br>"+o,document.getElementById("price").innerHTML="Price: <br>"+m+" CHF"),""!=s){const t=google.maps.geometry.encoding.decodePath(s);new google.maps.Marker({position:a,map:map,title:e.elements.origin.value});const{PinView:o,AdvancedMarkerView:l}=await google.maps.importLibrary("marker"),i=new o({background:"#ffffff"});new l({map:map,position:r,content:i.element,title:e.elements.destination.value});new google.maps.Polyline({path:t,strokeColor:"#FF0004",strokeWeight:3,strokeOpacity:.7}).setMap(map);var n=new google.maps.LatLngBounds;n.extend(a),n.extend(r),map.fitBounds(n)}document.getElementById("loading").style.display="none",switchTab("trip")}}})),document.getElementById("type-row").addEventListener("click",typeHandler);var t=document.getElementById("trip-form");t.addEventListener("submit",(async function(e){if(e.preventDefault(),validateTripForm()){const e={dataSource:"trip",name:t.elements.name.value,email:t.elements.email.value,phone:t.elements.phone.value,baggageCount:t.elements.baggageCount.value,personCount:t.elements.personCount.value,childCount:t.elements.childCount.value,date:t.elements.date.value,pickupTime:t.elements.pickupTime.value,comment:t.elements.comment.value};submitedData.trip=e,submitedData.dataSource="trip",submitedData.language=languageCode;const n=JSON.stringify(submitedData);document.getElementById("loading").style.display="block";const o=await submitTripForm(n);if(o.status){const{route:e,trip:t,price:n}=o;document.getElementById("booking-class").innerHTML=textTranslations.TABS.REQUEST.BOOKING_CLASS+": "+e.car,document.getElementById("dateTime").innerHTML=textTranslations.TABS.TRIP.DATE+": "+t.date+" / "+textTranslations.TABS.TRIP.TIME+": "+t.pickupTime,document.getElementById("originDestination").innerHTML=textTranslations.TABS.ROUTE.ORIGIN+": "+e.origin+" / "+textTranslations.TABS.ROUTE.DESTINATION+": "+e.destination,document.getElementById("totalPrice").innerHTML=textTranslations.TABS.TRIP.PRICE+": "+n+" CHF",document.getElementById("counts").innerHTML=textTranslations.TABS.TRIP.PERSONS+": "+t.personCount+" / "+textTranslations.TABS.TRIP.CHILDREN+": "+t.childCount+" / "+textTranslations.TABS.TRIP.BAGGAGE+": "+t.baggageCount,document.getElementById("request-comment").innerHTML=textTranslations.TABS.TRIP.COMMENT+": "+t.comment}else document.getElementById("request").innerHTML="<h2>"+textTranslations.ERRORS.UNKNOWN.SOMETHING_WENT_WRONG+"</h2><p>"+textTranslations.ERRORS.UNKNOWN.REQUEST_COULD_NOT_SUBMITED+"</p><p>"+textTranslations.ERRORS.UNKNOWN.PLEASE_CONTACT_US+"</p>";document.getElementById("loading").style.display="none",switchTab("request")}})),document.getElementById("reload").addEventListener("click",(function(e){location.reload();JSON.stringify({dataSource:"config"});return!1}))}function carsSelectChange(){const e=document.getElementById("cars"),t=document.getElementById("baggageCount"),n=document.getElementById("personCount"),o=document.getElementById("childCount"),a=parseInt(e.options[e.selectedIndex].getAttribute("maxPerson")),l=parseInt(e.options[e.selectedIndex].getAttribute("maxBaggage"));if(t.childElementCount<=1)for(let e=0;e<=l;e++){let n=document.createElement("option");n.value=e,n.textContent=e,t.appendChild(n)}if(o.childElementCount<=1)for(let e=0;e<=a;e++){let t=document.createElement("option");t.value=e,t.textContent=textTranslations.TABS.TRIP.PERSON+" "+e,n.appendChild(t);let a=document.createElement("option");a.value=e,a.textContent=textTranslations.TABS.TRIP.CHILDREN+" "+e,o.appendChild(a)}}function handleTranslation(e){document.getElementById("route-headline").innerHTML=e.TABS.ROUTE.HEADLINE,document.getElementById("transfer-ride").value=e.TABS.ROUTE.TYPE_ROW.TRANSFER_RIDE,document.getElementById("per-hour").value=e.TABS.ROUTE.TYPE_ROW.PER_HOUR,document.getElementsByName("origin")[0].placeholder=e.TABS.ROUTE.ORIGIN,document.getElementsByName("destination")[0].placeholder=e.TABS.ROUTE.DESTINATION,document.getElementsByName("flightNumber")[0].placeholder=e.TABS.ROUTE.FLIGHT_NUMBER,document.getElementById("return-drive-label").innerHTML=e.TABS.ROUTE.RETURN_DRIVE_SELECT.LABEL+":",document.getElementById("hours-select-label").innerHTML=e.TABS.ROUTE.HOURS_SELECT.LABEL+":",document.getElementById("cars-label").innerHTML=e.TABS.ROUTE.CARS.LABEL+":",document.getElementById("one-way").innerHTML=e.TABS.ROUTE.RETURN_DRIVE_SELECT.ONE_WAY,document.getElementById("round-trip").innerHTML=e.TABS.ROUTE.RETURN_DRIVE_SELECT.ROUND_TRIP,document.getElementById("please-select").innerHTML=e.TABS.ROUTE.CARS.PLEASE_SELECT,document.getElementById("route-submit").value=e.TABS.ROUTE.SUBMIT_BUTTON,document.getElementById("trip-headline").innerHTML=e.TABS.TRIP.HEADLINE,document.getElementsByName("name")[0].placeholder=e.TABS.TRIP.NAME,document.getElementsByName("email")[0].placeholder=e.TABS.TRIP.EMAIL,document.getElementsByName("phone")[0].placeholder=e.TABS.TRIP.PHONE,document.getElementById("baggage").innerHTML=e.TABS.TRIP.BAGGAGE,document.getElementsByName("date")[0].placeholder=e.TABS.TRIP.DATE,document.getElementsByName("pickupTime")[0].placeholder=e.TABS.TRIP.TIME,document.getElementById("maxPersonError").innerHTML=e.ERRORS.VEHICLE_CAPACITY,document.getElementById("dateTimeError").innerHTML=e.ERRORS.BOOKING_DATETIME,document.getElementsByName("comment")[0].placeholder=e.TABS.TRIP.COMMENT,document.getElementById("trip-submit").value=e.TABS.TRIP.SUBMIT_BUTTON,document.getElementById("request-headline").innerHTML=e.TABS.REQUEST.HEADLINE,document.getElementById("your-request").innerHTML=e.TABS.REQUEST.YOUR_BOOKING_REQUEST+":",document.getElementById("request-message").innerHTML=e.TABS.REQUEST.WE_WILL_CONTACT_YOU,document.getElementById("reload").value=e.TABS.REQUEST.SUBMIT_BUTTON,map.setOptions({language:language}),orignAutocomplete.setOptions({language:language}),destinationAutocomplete.setOptions({language:language})}function validateRouteForm(){return!0}function validateTripForm(){document.getElementById("dateTimeError").style.display="none",document.getElementById("maxPersonError").style.display="none";var e=document.getElementById("route-form"),t=document.getElementById("trip-form");const n=t.elements.date.value,o=t.elements.pickupTime.value,a=t.elements.personCount.value,l=t.elements.childCount.value,r=parseInt(a)+parseInt(l),s=e.elements.cars,i=parseInt(s.options[s.selectedIndex].getAttribute("maxPerson")),m=new Date(n+" "+o);m.setHours(m.getHours()-12);const d=m>new Date;0==d&&(document.getElementById("dateTimeError").style.display="block");const u=parseInt(r)<=parseInt(i);return 0==u&&(document.getElementById("maxPersonError").style.display="block"),d&&u}function typeHandler(e){var t=e.target;if(!t.matches("input"))return;var n=document.getElementById("type-row").getElementsByTagName("input");for(const e of n)e.classList.remove("selected");t.classList.add("selected");const o=e.target.id;document.getElementById("route-form").elements.type.value=o,"transfer-ride"==o?(document.getElementsByName("destination")[0].style.display="flex",document.getElementsByName("destination")[0].setAttribute("required",""),document.getElementsByName("flightNumber")[0].style.display="flex",document.getElementById("return-drive").style.display="flex",document.getElementById("return-drive-label").style.display="flex",document.getElementById("hours-select").style.display="none",document.getElementById("hours-select-label").style.display="none",document.getElementById("distance").style.display="flex",document.getElementById("duration").style.display="flex"):(document.getElementsByName("destination")[0].style.display="none",document.getElementsByName("destination")[0].removeAttribute("required"),document.getElementsByName("flightNumber")[0].style.display="none",document.getElementById("return-drive").style.display="none",document.getElementById("return-drive-label").style.display="none",document.getElementById("hours-select").style.display="flex",document.getElementById("hours-select-label").style.display="flex",document.getElementById("distance").style.display="none",document.getElementById("duration").style.display="none")}function createHoursSelect(e,t){const n=document.getElementById("hours-select");if(!(n.childElementCount>1)){n.style.display="none";for(let o=1;o<=e;o++){let e=document.createElement("option");e.value=o,e.textContent=o+" ("+textTranslations.TABS.ROUTE.HOURS_SELECT.INCLUSIVE+o*t+"Km)",n.appendChild(e)}}}async function submitRouteForm(e){try{const t={method:"POST",headers:{"Content-Type":"application/json"},body:e,redirect:"follow"},n=await fetch("https://route-calculation.yashbindal.workers.dev/route",t);if(!n.ok)throw new Error("Network response was not ok");return await n.json()}catch(e){throw e}}async function submitTripForm(e){try{const t={method:"POST",headers:{"Content-Type":"application/json"},body:e,redirect:"follow"},n=await fetch("https://route-calculation.yashbindal.workers.dev/trip",t);if(!n.ok)throw new Error("Network response was not ok");return await n.json()}catch(e){throw e}}initForm(),handleTranslation(textTranslations);

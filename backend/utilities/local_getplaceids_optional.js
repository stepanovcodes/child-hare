require("dotenv").config();
const BASE_URL = `${process.env.NODE_BASE_URL}/childcares`;

async function getPlaceIds() {
  const childCares = await getChildCares();
  childCares.forEach(async (element) => {
    if ( element.placeId === null){
      const result = await getPlaceId(element);
      if (result.status === 'OK') {
        // console.log(result.predictions[0].place_id)
        updateChildCare(element.uuid,{placeId: result.predictions[0].place_id})
      }
    }
  });;
}

async function getChildCares() {
  try {
    const data = await index();
    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err)
  }
}

async function index() {
  const res = await fetch(BASE_URL, { method: "GET"});
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Invalid Request");
  }
}

async function getPlaceId(element) {

  const key = process.env.GOOGLE_API_KEY;
  const input = `${element.name.replace(/ /g, "%20")}%20${element.address.replace(/ /g, "%20")}%20${element.city.replace(/ /g, "%20")}%20${element.province.replace(/ /g, "%20")}`
  // console.log(input)
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${key}`;
  const headers = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "GET",
    headers: headers,
  };

  try {
    const res = await fetch(url, requestOptions);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Invalid POST Request");
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

async function updateChildCare(uuid,data){
  try {
      const updatedChildCare = await update(uuid,data)
      return updatedChildCare
  }catch(err){
      console.log(err)
      throw new Error(err)
  }
}

async function update(uuid, updatedData) {
  const url = `${BASE_URL}/${uuid}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (res.ok) {
  } else {
    throw new Error("Invalid PUT Request");
  }
}

getPlaceIds()




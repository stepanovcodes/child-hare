import axios from 'axios';
const BASE_URL = `${process.env.NEXT_APP_BASE_URL}/childcares`;

export async function index() {
    const res = await axios.get(BASE_URL);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Invalid Request");
    }
  }


export async function detail(uuid) {
  const url = `${BASE_URL}/${uuid}`;
  const res = await axios.get(url);
  if (res.status === 200) {
    return res.data;
  } else {
    throw new Error("Invalid Request");
  }
}
  
  export async function create(data) {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return res.json();
      }
    } catch (err) {
      throw new Error("Invalid Request");
    }
  }
  
  export async function destroy(uuid) {
    const url = `${BASE_URL}/${uuid}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (res.ok) {
    } else {
      throw new Error("Invalid Request");
    }
  }
  
  export async function update(uuid, updatedData) {
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
// some constants

const SET_ENTRIES = 'SET_ENTRIES';
const ADD_ENTRY = 'ADD_ENTRY';
const UPDATE_ENTRY = 'UPDATE_ENTRY';
const DELETE_ENTRY = 'DELETE_ENTRY';

// action creators

export const set_entries = (entries) => ({
  type: SET_ENTRIES,
  payload: entries
});

const add_entry = (entry) => ({
  type: ADD_ENTRY,
  payload: entry
});

const update_entry = (editedEntry) => ({
  type: UPDATE_ENTRY,
  payload: editedEntry
});

const delete_entry = (entry) => ({
  type: DELETE_ENTRY,
  payload: entry
});

// actions
export const fetchEntries = (token) => async dispatch => {
  const response = await fetch('/api/entries', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if  (response.ok) {
    const json = await response.json();
    dispatch(set_entries(json));
  }
  else return;
};

export const createEntry = (entry, token) => async dispatch => {
  const response = await fetch('/api/entries',{
      method: 'POST',
      body: JSON.stringify(entry),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
  });
  const json = await response.json();
  if (response.ok) {
    dispatch(add_entry(json));
  }
  return json;
}

export const updateEntry = (editedEntry, url, token) => async dispatch => {
  console.log(editedEntry);
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(editedEntry),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  const json = await response.json();
  editedEntry.user_id = json.user_id;
  console.log(json);
  if (response.ok) {
    dispatch(update_entry(editedEntry));
  }
  return json;
};

export const deleteEntry = (entry, token) => async dispatch => {
  const response = await fetch('/api/entries/' + entry._id,{
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const json = await response.json();
  if (response.ok) {
    dispatch(delete_entry(json))
  }
  return json;
}

// reducer

const entriesReducer = (state = [], action) => {
  Object.freeze(state);
  let newState = [];
  if (state) newState = [...state];

  switch(action.type){
    case SET_ENTRIES:
      return action.payload;
    case ADD_ENTRY:
      newState = [...newState, action.payload];
      return newState;
    case UPDATE_ENTRY:
      newState = newState.filter((entry) => {
        return entry._id !== action.payload._id;
      });
      newState = [...newState, action.payload];
      return newState;
    case DELETE_ENTRY:
      newState = newState.filter((entry) => {
        return entry._id !== action.payload._id; 
      });
      return newState;
    default:
      return state;
  };
};

export default entriesReducer;
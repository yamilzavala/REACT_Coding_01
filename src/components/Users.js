import axios from 'axios';
import {useState, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';

//type field
const fieldsName = {
    CITY: 'city',
    DESCRIPTION: 'description',
    NAME: 'name',
    NUMBER: 'number'
}

const Users = () => {
    const [locationsData, setLocationsData] = useState([]);
    const [sorting, setSorting] = useState(false);
    const [sortingNumber, setSortingNumber] = useState(false);
    const [filterLocations, setFilterLocations] = useState([]);
    
    const fetchUsers = () => {
        return axios.get(`https://randomuser.me/api/?results=20`)
        .then(res => {
            //only locations
            const locations = [];
            for (let index = 0; index < res.data.results.length; index++) {
               locations.push( res.data.results[index].location)                
            }            
           
            //only property value
            const objLocation = [];
            for (const {coordinates, street, timezone, ...rest} of locations) {
                objLocation.push({
                        ...rest,
                        latitude: coordinates.latitude,
                        logitude: coordinates.longitude,
                        name: street.name,
                        number: street.number,
                        description: timezone.description,
                        offset: timezone.offset
                })
            }  
            setLocationsData(objLocation);            
        })
        .catch(err => console.log(err))
    }

    //effect for get the locations
    useEffect(() => {
        fetchUsers();
    }, []);

    //handle order keys
    const handleOrder = (fieldToOrder) => {
        setSorting(!sorting);
        console.log(fieldToOrder);
        console.log('sorting', sorting, 'fieldToOrder', fieldToOrder);
        if (sorting) {
            orderAscendent(fieldToOrder)
        } else {
            orderDescendent(fieldToOrder)
        }
    }

    //ascendent order
    function orderAscendent(keyToOrderBy) {        
        locationsData.sort((a, b) => {           
            if (a[keyToOrderBy].toLowerCase() > b[keyToOrderBy].toLowerCase() ) {
                return 1
            } else if((a[keyToOrderBy].toLowerCase() < b[keyToOrderBy].toLowerCase())) {
                return -1;
            }
            return 0;
        })
    }

     //descendent order
    function orderDescendent(keyToOrderBy) {
        locationsData.sort((a, b) => {
            if (a[keyToOrderBy].toLowerCase() < b[keyToOrderBy].toLowerCase()) {
                return 1
            } else if((a[keyToOrderBy].toLowerCase() > b[keyToOrderBy].toLowerCase())) {
                return -1;
            }
            return 0;
        })
    }

    //order number fields
    function handleOrderByNumber(keyToOrderBy) {
        setSortingNumber(!sortingNumber);
        if (sortingNumber) {
            return locationsData.sort((a, b) => a[keyToOrderBy] - b[keyToOrderBy])            
        } else {
            return locationsData.sort((a, b) => b[keyToOrderBy] - a[keyToOrderBy])
        }       
    }

    //filter
     function handleFilter(e) {                
        if (e.target.value !== undefined) {
            const dataFiltered = locationsData.filter(currentLocation => currentLocation.city.toLowerCase() ===  e.target.value.toLowerCase()); 
            setFilterLocations(dataFiltered)               
        } else {
            setFilterLocations([])
        }             
    }

  

    return(
        <div>
            <h6>Locations</h6>   
            <input placeholder="Enter a text to filter" type="text" onChange={(e) => handleFilter(e)}/>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleOrder(fieldsName.CITY)}>City</th>
                        <th onClick={() => handleOrder(fieldsName.DESCRIPTION)}>Description</th>
                        <th onClick={() => handleOrder(fieldsName.NAME)}>Name</th>
                        <th onClick={() => handleOrderByNumber(fieldsName.NUMBER)}>Number</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (filterLocations.length) ? 
                            filterLocations.map(location => 
                                <tr key={uuidv4()}>                       
                                    <td >{location.city}</td>
                                    <td >{location.description}</td>
                                    <td>{location.name}</td>
                                    <td>{location.number}</td>
                                </tr>       
                            )
                        :
                            locationsData.map(location => 
                                <tr key={uuidv4()}>                       
                                    <td >{location.city}</td>
                                    <td >{location.description}</td>
                                    <td>{location.name}</td>
                                    <td>{location.number}</td>
                                </tr>       
                            )
                    }                    
                </tbody>               
            </table>            
        </div>
    )
}

export default Users;
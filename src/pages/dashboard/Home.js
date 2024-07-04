import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, query, where, orderBy, limit, startAfter, endBefore, limitToLast, doc, updateDoc, deleteDoc, onSnapshot, getCountFromServer } from 'firebase/firestore';
import SearchIntakes from "./SearchIntakes";
import checkAuth from '../../components/authorize/checkAuth';

const PAGE_SIZE = 3; // Number of items per page

const Home=()=> {
    const editingItemIntakeRef = useRef();

    const [entries, setEntries] = useState([]);
    const [editingItem, setEditingItem] = useState({});
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const intakeCollectionRef = collection(db, "water-intakes");
    const totalPageQuery=query(intakeCollectionRef,
        where("userId", "==", auth.currentUser?.uid || ""));

    useEffect(() => {
        getCountFromServer(totalPageQuery).then((querySnapshot)=>{
            let totalDocCount=querySnapshot.data().count;
            setTotalPages(Math.ceil(totalDocCount/PAGE_SIZE));
        })

        const entriesListQuery = query(intakeCollectionRef,
            where("userId", "==", auth.currentUser?.uid || ""),
            orderBy("entryDate"),
            limit(PAGE_SIZE));    

        onSnapshot(entriesListQuery, (querySnapshot) => {
            setEntries(querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
        })
    }, []);

    const showNext = ({ item }) => {
        if (entries.length === 0) {
            alert("Thats all we have for now !")
        } else {
            const entriesListQuery = query(intakeCollectionRef,
                where("userId", "==", auth.currentUser?.uid || ""),
                orderBy("entryDate"),
                limit(PAGE_SIZE),
                startAfter(item.entryDate));

            onSnapshot(entriesListQuery, (querySnapshot) => {
                setEntries(querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })));
                setPage(page + 1)
            });
        }
    };
    const showPrevious = ({ item }) => {
        if(item){
        const entriesListQuery = query(intakeCollectionRef,
            where("userId", "==", auth.currentUser?.uid || ""),
            orderBy("entryDate"),
            endBefore(item.entryDate),
            limitToLast(PAGE_SIZE));

        onSnapshot(entriesListQuery, (querySnapshot) => {
            setEntries(querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
            setPage(page - 1)
        });
    }else{  
            
        const entriesListQuery = query(intakeCollectionRef,
            where("userId", "==", auth.currentUser?.uid || ""),
            orderBy("entryDate"),
            limitToLast(PAGE_SIZE));

        onSnapshot(entriesListQuery, (querySnapshot) => {
            setEntries(querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
            setPage(page - 1)
        });
    }
    };


    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();

        return `${mm}/${dd}/${yyyy}`;
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleSaveItem = () => {
        let editedIntake = parseInt(editingItemIntakeRef.current.value);
        if (editedIntake > 0) {
            const updatedItems = entries.map((item) => {
                if (item.id === editingItem.id) {
                    return { ...item, intake: editedIntake };
                }
                return item;
            });
            setEntries(updatedItems);


            const intakeDocRef = doc(db, 'water-intakes', editingItem.id)
            updateDoc(intakeDocRef, {
                ...editingItem
            }).then(() => {
                console.log("Updated in Firebase");
                setEditingItem({});
            }).catch((error) => {

                console.error('Error updating document: ', error);

            });
        }
    };


    const handleCancelEdit = () => {
        setEditingItem({});
    };

    const handleDelete = (id) => {
        const filteredItems = entries.filter((item) => item.id !== id);
        const intakeDocRef = doc(db, 'water-intakes', id);
        deleteDoc(intakeDocRef).then(() => {
            console.log("Deleted from Firebase");
            getCountFromServer(totalPageQuery).then((querySnapshot)=>{
                let totalDocCount=querySnapshot.data().count;
                setTotalPages(Math.ceil(totalDocCount/PAGE_SIZE));
            })
        }).catch((e) => {
            console.log(e)
        })
    };

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-lg-9 text-start">
                    <h5>Compare water intake between chosen dates</h5>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <SearchIntakes entries={entries} />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-lg-9 text-start">
                    <h5>List of water intakes</h5>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Date of Entry</th>
                                <th>Intake</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry =>
                            (<tr key={entry.id}>
                                <td>{convertTimestamp(entry.entryDate)}</td>
                                <td>
                                    {editingItem.id === entry.id ? (
                                        <input type="number" value={editingItem.intake} ref={editingItemIntakeRef} onChange={(e) => setEditingItem({ ...editingItem, intake: e.target.value })} />
                                    ) : (
                                        entry.intake
                                    )}
                                </td>
                                <td>
                                    {editingItem.id === entry.id ? (
                                        <>
                                            <button className="btn btn-outline-success me-3" onClick={handleSaveItem}> Save </button>
                                            <button className="btn btn-outline-secondary me-3" onClick={handleCancelEdit}> Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className='btn btn-outline-warning me-3' onClick={() => handleEditItem(entry)}>Edit</button>
                                            <button className='btn btn-outline-danger me-3' onClick={() => handleDelete(entry.id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        //show previous button only when we have items
                        page === 1 ? '' :
                            <button className='btn btn-secondary me-3' onClick={() => showPrevious({ item: entries? entries[0] : null  })}>Previous</button>
                    }
                    {
                        //show next button only when we have items
                        page >= totalPages ? '' :
                            <button className='btn btn-secondary me-3' onClick={() => showNext({ item: entries[entries.length - 1] })}>Next</button>
                    }
                </div>
            </div>
        </div>
    );
}

export default checkAuth(Home);
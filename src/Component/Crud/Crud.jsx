import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';


export default function Crud() {
    const [filterdItem, setfilterdItem] = useState(0)
    const [Catogories, setCatogories] = useState([])
    const nameRef = useRef()
    const priceRef = useRef()
    const categoryRef = useRef()
    const QuantityRef = useRef()
    const [hidden, sethidden] = useState(false)
    const [loadingHidden, setloadingHidden] = useState(false)
    const imagee = useRef()
    const [NewItems, setNewItems] = useState(undefined)
    const [activebutton, setactivebutton] = useState(null)
    const navigate = useNavigate("")

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://crud-system-app-api.vercel.app/product/", {
                headers: {
                    "Authorization": JSON.parse(localStorage.getItem("Authentication"))
                }
            });
            const uniqueCategories = [...new Set(response.data.data.products.map(item => item.category))];
            setCatogories(uniqueCategories);
            setNewItems(response.data.data.products)
            setloadingHidden(false)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    const fetctAddProducts = async (product) => {
        try {
            const response = await axios.post("https://crud-system-app-api.vercel.app/product/add", product, {
                headers: {
                    "Authorization": JSON.parse(localStorage.getItem("Authentication"))
                }
            });
            setloadingHidden(false)
            fetchProducts();
        } catch (error) {
            console.error("Error fetching add products:", error);
        }
    };
    const fetctUpdateProducts = async (id, productQuantity, productName, price, category, attachment) => {
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("quantity", productQuantity);
        if (attachment) {
            formData.append("attachment", attachment);
        }
        try {
            const { data } = await axios.patch(`https://crud-system-app-api.vercel.app/product/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": JSON.parse(localStorage.getItem("Authentication"))
                }
            }
            )
        } catch (error) {
            console.error("Error fetching update products:", error);
        }
    };
    useEffect(() => {
        fetchProducts();

    }, [])

    async function ADD(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("productName", e.target.name.value);
        formData.append("category", e.target.category.value);
        formData.append("price", e.target.price.value);
        formData.append("quantity", e.target.quantity.value);
        if (imagee.current.files && imagee.current.files[0]) {
            formData.append("attachment", imagee.current.files[0]);
        }
        setloadingHidden(true)
        await fetctAddProducts(formData);

        e.target.name.value = ''
        e.target.price.value = ''
        e.target.swra.value = ''
        e.target.category.value = ''
        e.target.quantity.value = ''

    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://crud-system-app-api.vercel.app/product/delete/${id}`, {
                headers: {
                    "Authorization": JSON.parse(localStorage.getItem("Authentication"))
                }
            })
        } catch (error) {
            console.error("Error fetching add products:", error);
        }
        fetchProducts()
    }
    const incressQun = async (id, qun) => {
        const product = NewItems.find(item => item._id === id);
        if (product) {
            await fetctUpdateProducts(id, qun + 1, product.productName, product.price, product.category, '');
            fetchProducts();
        }
    }
    const decressQun = async (id, qun) => {
        if (qun > 0) {
            const product = NewItems.find(item => item._id === id);
            if (product) {
                await fetctUpdateProducts(id, qun - 1, product.productName, product.price, product.category, '');
                fetchProducts();
            }
        }
    }
    const updateFront = (id) => {
        const filter = NewItems.filter((item) => item._id === id)
        setfilterdItem(filter)
        nameRef.current.value = filter[0].productName
        priceRef.current.value = filter[0].price
        categoryRef.current.value = filter[0].category
        QuantityRef.current.value = filter[0].quantity
        sethidden(true)
    }
    const updateProduct = async () => {
        setloadingHidden(true)
        await fetctUpdateProducts(filterdItem[0]._id, QuantityRef.current.value, nameRef.current.value, priceRef.current.value, categoryRef.current.value, imagee.current.files && imagee.current.files[0] ? imagee.current.files[0] : '')
        fetchProducts()
        sethidden(false)

        nameRef.current.value = ""
        priceRef.current.value = ""
        categoryRef.current.value = ""
        QuantityRef.current.value = ""
        imagee.current.value = ""

    }
    const sortItems = async (sort) => {
        if (sort == "All") {
            if (NewItems.length > 1) {
                console.log("<1");
            }
            return fetchProducts()

        }
        await fetchProducts();
        setNewItems((prevItems) => prevItems.filter((item) => item.category === sort));
    };
    const handleExport = () => {
        NewItems.forEach(item => {
            item.image = item.image.secure_url
        });
        const ws = XLSX.utils.json_to_sheet(NewItems);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "ProductList.xlsx");
    };
    const logout = ()=>{
        navigate('/login')
        localStorage.removeItem("Authentication")
    }

    return <>
        <h1 className='text-5xl font-bold text-center py-4'>Crud System</h1>
        <a onClick={() => { logout() }} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline me-5 absolute right-10 top-7">Logout</a>

        <div className='container w-5/6 py-8 px-8 shadow-xl '>
            <form className='w-full flex flex-col mb-5' onSubmit={ADD} >
                <div className="relative mb-5">
                    <input ref={nameRef} required name='name' type="text" id="name" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-green-600 peer" placeholder=" " />
                    <label htmlFor="name" className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Name</label>
                </div>
                <div className="relative mb-5">
                    <input ref={priceRef} required name='price' type="number" id="price" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="price" className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Price</label>
                </div>
                <input type="file" accept="image/png, image/gif, image/jpeg" name='swra' ref={imagee} className=" mb-5 px-2.5 py-2.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input"></input>
                <div className="relative mb-5">
                    <input ref={categoryRef} required name='category' type="text" id="category" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="category" className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Category</label>
                </div>
                <div className="relative mb-5">
                    <input ref={QuantityRef} required name='quantity' type="number" id="quantity" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label htmlFor="quantity" className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Quantity</label>
                </div>
                <button type='submit' className={`py-3 px-4 bg-blue-600 rounded-md text-white ms-auto ${hidden == true || loadingHidden == true ? "hidden" : ""}`}>Add New Item</button>
                <button disabled className={`py-3 px-4 bg-blue-600 rounded-md text-white ms-auto ${loadingHidden == false ? "hidden" : ""}`}>
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>loading.... </button>
                <button onClick={() => { updateProduct() }} type='button' className={`py-3 px-4 bg-yellow-600 rounded-md text-white ms-auto ${!hidden || loadingHidden ? "hidden" : ""}`}>Update Item</button>
            </form>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className='buttons flex justify-center'>
                    {["All", ...Catogories]?.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setactivebutton(index);
                                sortItems(item);
                            }}
                            type="button"
                            className={`${activebutton === index ? 'bg-blue-900' : 'bg-blue-700'}
        text-white hover:bg-blue-800
        font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${NewItems?.length < 1 ? "hidden" : ""}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-16 py-3">
                                <span className="sr-only">Image</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Qty
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {NewItems?.map((item) => (
                            <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="p-4 w-5">
                                    <img src={item.image?.secure_url} alt={item.name} />
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {item.productName
                                    }
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <button onClick={() => { decressQun(item._id, item.quantity) }} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                            <span className="sr-only">Quantity button</span>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                                            </svg>
                                        </button>
                                        <div>
                                            <input value={item.quantity} disabled type="number" id="first_product" className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='0' required />
                                        </div>
                                        <button onClick={() => { incressQun(item._id, item.quantity) }} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                                            <span className="sr-only">Quantity button</span>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    ${item.price}
                                </td>
                                <td className="px-6 py-4">
                                    <a onClick={() => { handleDelete(item._id) }} className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline me-5">Remove</a>
                                    <a onClick={() => { updateFront(item._id) }} className="cursor-pointer font-medium text-yellow-600 dark:text-yellow-500 hover:underline">update</a>
                                </td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
            <div className='w-full flex items-center mt-3'>
                <button onClick={() => { handleExport() }} className={` mx-auto py-3 px-4 bg-green-600 rounded-md text-white ${NewItems?.length < 1 ? "hidden" : ""} `}>EXPORT TO EXCEL FILE</button>

            </div>
        </div>
    </>
}
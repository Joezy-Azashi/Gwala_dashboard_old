import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Checkbox, Chip, CircularProgress, Dialog, OutlinedInput, Grid, IconButton, InputAdornment, MenuItem, Select, Tooltip, Typography, Divider, FormControl, InputLabel, Autocomplete, DialogContent, DialogActions } from '@mui/material'
import { BasicSelect, IOSSwitch, TextField } from '../UI'
import { Close, EditOutlined, NotificationsNoneOutlined, Place, QrCode2, Search, SettingsSuggestOutlined } from '@mui/icons-material';
import cover from '../../assets/cover.png'
import restaurant from '../../assets/categorycover/restaurant.jpg'
import appliance from '../../assets/categorycover/HomeAppliance.jpg'
import health from '../../assets/categorycover/Health.jpg'
import accessories from '../../assets/categorycover/accessories.jpg'
import beauty from '../../assets/categorycover/beauty.jpg'
import gaming from '../../assets/categorycover/gaming.jpg'
import fitness from '../../assets/categorycover/fitness.jpg'
import carpart from '../../assets/categorycover/carpart.jpg'
import tech from '../../assets/categorycover/tech.jpg'
import chocolate from '../../assets/categorycover/ChocolateryPastry.jpg'
import FileUploadService from "../../config/FileUpload";
import hobbies from '../../assets/categorycover/Hobbies.jpg'
import transport from '../../assets/categorycover/transport.jpg'
import market from '../../assets/categorycover/Markets.jpg'
import instagram from '../../assets/socialmedia/instagram.png'
import facebook from '../../assets/socialmedia/facebook.png'
import x from '../../assets/socialmedia/x.png'
import website from '../../assets/socialmedia/website.png'
import catalogue from '../../assets/socialmedia/catalogue.png'
import { useLocale } from '../../locales';
import MerchantSlider from '../UI/MerchantSlider';
import UploadProfileImage from './UploadProfileImage';
import CountryList from "country-list-with-dial-code-and-flag";
import isEmail from "validator/lib/isEmail";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import DeleteMerchant from './DeleteMerchant';
import ShortUniqueId from 'short-unique-id'
import BasicSelectBlue from '../UI/BasicSelectBlue';
import { cities } from '../../config/cities';
import dayjs from 'dayjs';
import QrCodeDialog from './QrCodeDialog';
import PageSpinner from '../pagespinner/PageSpinner';
import GetLocationDialog from './GetLocationDialog';
import axiosMerchant from '../../api/merchantRequest';
import AvailabilityDialog from './AvailabilityDialog';
import SocialMedia from './SocialMedia';
import Keywords from './Keywords';

const socialMediaOptions = [
    { provider: 'Instagram', url: '', image: instagram },
    { provider: 'Facebook', url: '', image: facebook },
    { provider: 'X', url: '', image: x },
    { provider: 'Website', url: '', image: website },
    { provider: 'Catalogue', url: '', image: catalogue }
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function CreateMerchantForm({ setUserDate, setProfileImage }) {
    const { formatMessage } = useLocale();
    const { id } = useParams()
    const uid = new ShortUniqueId({ length: 4 });
    const navigate = useNavigate()
    const supportedCountries = ["MA", "US", "TN", "GH"].map((code) =>
        CountryList.findOneByCountryCode(code)
    );
    const phoneNumberRegex = /^(0|\+212|00212|001|00216|00233|\+1|\+216|\+233)\d{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%^*?&]{8,}$/;
    const webAddressRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z0-9-]+)+((\/[a-zA-Z0-9-]*)+)?$/;
    const specialChar = ["$", "!", "%", "*", "?", "&"]
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    const uppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    const lowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    const ribNumberRegex = /^\d{24}$/;

    const [logo, setLogo] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [qrcode, setQrcode] = useState("")
    const [openqr, setOpenqr] = useState({ data: "", state: false })
    const [merchantName, setMerchantName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [rib, setRib] = useState("")
    const [ice, setIce] = useState("")
    const [rc, setRc] = useState("")
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [availableOptions, setAvailableOptions] = useState(socialMediaOptions);
    const [keywords, setKeywords] = useState([]);
    const [owners, setOwners] = useState([])
    const [ownerId, setOwnerId] = useState([])
    const [email, setEmail] = useState("")
    const [hadEmail, setHadEmail] = useState(false)
    const [hadOwner, setHadOwner] = useState(false)
    const [numberUsedDialog, setNumberUsedDialog] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [address, setAddress] = useState("")
    const [webAddress, setWebAddress] = useState("")
    const [storePhone, setStorePhone] = useState("")
    const [countryCode, setCountryCode] = useState(supportedCountries[0].dial_code)
    const [ownerCountryCode, setOwnerCountryCode] = useState(supportedCountries[0].dial_code)
    const [merchantPhone, setMerchantPhone] = useState("")
    const [city, setCity] = useState("")
    const [services, setServices] = useState("")
    const [category, setCategory] = useState([])
    const [searchCat, setSearchCat] = useState("")
    const [searchOwner, setSearchOwner] = useState("")
    const [coverLoad, setCoverLoad] = useState(false)
    const [load, setLoad] = useState(false)
    const [notifyPhones1, setNotifyPhones1] = useState("")
    const [notifyPhones2, setNotifyPhones2] = useState("")
    const [notifications, setNotifications] = useState([])
    const [reimbursementTime, setReimbursementTime] = useState("")
    const [rate, setRate] = useState(0)
    const [cashbackRate, setCashbackRate] = useState(0)
    const [cat, setCat] = useState([])
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [password, setPassword] = useState(uid.rnd() +
        specialChar[Math.floor(Math.random() * specialChar.length)] +
        numbers[Math.floor(Math.random() * numbers.length)] +
        uppercase[Math.floor(Math.random() * uppercase.length)] +
        lowercase[Math.floor(Math.random() * lowercase.length)])
    const [description, setDescription] = useState("")
    const [startTime, setStartTime] = useState(dayjs().startOf('day').set('hour', 8))
    const [endTime, setEndTime] = useState(dayjs().startOf('day').set('hour', 17))
    const [schedule, setSchedule] = useState([
        { isOpen: "false", day: "mon" },
        { isOpen: "false", day: "tue" },
        { isOpen: "false", day: "wed" },
        { isOpen: "false", day: "thu" },
        { isOpen: "false", day: "fri" },
        { isOpen: "false", day: "sat" },
        { isOpen: "false", day: "sun" }
    ])
    const [openAvailability, setOpenAvailability] = useState(false)
    const [openSocialMedia, setOpenSocialMedia] = useState(false)
    const [openKeywords, setOpenKeywords] = useState(false)
    const [openPicUpload, setOpenPicUpload] = useState({ type: "", state: false });
    const [loading, setloading] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [statusLoading, setStatusLoading] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [error, setError] = useState(false)
    const [openMap, setOpenMap] = useState(false)
    const [lng, setLng] = useState();
    const [lat, setLat] = useState();
    const [status, setStatus] = useState()

    const [days, setDays] = useState([
        { label: "M", string: "merchants.create.monday", value: "mon" },
        { label: "T", string: "merchants.create.tuesday", value: "tue" },
        { label: "W", string: "merchants.create.wednesday", value: "wed" },
        { label: "T", string: "merchants.create.thursday", value: "thu" },
        { label: "F", string: "merchants.create.friday", value: "fri" },
        { label: "S", string: "merchants.create.saturday", value: "sat" },
        { label: "S", string: "merchants.create.sunday", value: "sun" }
    ])

    const getAvailableDays = (data, startTime, endTime) => {
        if (schedule?.filter((ft) => ft?.day === data?.value)[0]?.isOpen === "true" && (startTime === "" && endTime === "")) {
            setSchedule(schedule?.map((el) => el?.day === data?.value ? { isOpen: "false", day: data?.value } : el))
            setDays(days?.map((el) => el?.value === data?.value ? { label: el?.label, string: el?.string, value: el?.value, openAt: "", closeAt: "" } : el))
        } else if (schedule?.filter((ft) => ft?.day === data?.value)[0]?.isOpen === "true" && startTime?.length > 0 || endTime?.length > 0) {
            setSchedule(schedule?.map((el) => el?.day === data?.value ? { isOpen: "true", day: data?.value, ...((startTime !== "" && { openAt: startTime }) || {}), ...((endTime !== "" && { closeAt: endTime }) || {}) } : el))
            setDays(days?.map((el) => el?.value === data?.value ? { label: el?.label, string: el?.string, value: el?.value, openAt: startTime, closeAt: endTime } : el))
        } else {
            setSchedule(schedule?.map((el) => el?.day === data?.value ? { isOpen: "true", day: data?.value, ...((startTime !== "" && { openAt: startTime }) || {}), ...((endTime !== "" && { closeAt: endTime }) || {}) } : el))
            setDays(days?.map((el) => el?.value === data?.value ? { label: el?.label, string: el?.string, value: el?.value, openAt: startTime, closeAt: endTime } : el))
        }
    }

    const createMerchant = () => {
        if (merchantName === "" ||
            !id && ownerId?.length < 1 && firstName === "" ||
            !id && ownerId?.length < 1 && lastName === "" ||
            (rib?.length > 1 && !ribNumberRegex.test(`${rib}`)) ||
            (email?.length > 0 && !isEmail(`${email}`)) ||
            !id && ownerId?.length < 1 && userEmail === "" ||
            !id && ownerId?.length < 1 && password === "" ||
            !id && ownerId?.length < 1 && !isEmail(`${userEmail}`) ||
            services === "" ||
            reimbursementTime === "" ||
            !id && ownerId?.length < 1 && merchantPhone === "" ||
            !id && ownerId?.length < 1 && merchantPhone[0] === "0" ||
            !id && ownerId?.length < 1 && !phoneNumberRegex.test(`${ownerCountryCode}${merchantPhone}`) ||
            services === "External" && webAddress?.length > 0 && !webAddressRegex.test(`${webAddress}`) ||
            storePhone === "" ||
            storePhone[0] === "0" ||
            !phoneNumberRegex.test(`${countryCode}${storePhone}`) ||
            city === "" ||
            category?.length < 1 ||
            notifyPhones1?.length > 0 && (notifyPhones1[0] !== "+" || notifyPhones1?.length < 11) ||
            notifyPhones2?.length > 0 && (notifyPhones2[0] !== "+" || notifyPhones2?.length < 11) ||
            (id && hadEmail) && (email?.length < 1 || !isEmail(`${email}`))
        ) {
            setError(true)
            toast(formatMessage({ id: "merchants.create.error" }), {
                theme: "colored",
                type: "error",
            });
        }
        else if (!id && ownerId?.length < 1 && !passwordRegex.test(`${password}`)) {
            setError(true)
            toast(formatMessage({ id: "merchants.passcheck" }), {
                theme: "colored",
                type: "error",
            });
        } else {
            setloading(true)

            if (id) {
                creatMerchantApiEdit()
            } else {
                axiosMerchant.post(`/merchants/validate`, {
                    countryCode: countryCode,
                    primaryPhone: storePhone,
                    OwnerId: ownerId.filter((ft) => ft?.role === "owner").map((el) => el.id)[0]
                })
                    .then((response) => {
                        if (response?.data?.status === "success") {
                            creatMerchantApiAdd()
                        } else {
                            setloading(false)
                            setNumberUsedDialog(true)
                        }
                    })
                    .catch((error) => {
                        setloading(false)
                        toast(error?.response?.data?.message, {
                            position: "top-right",
                            type: "error",
                            theme: "colored",
                        });
                    })
            }
        }

    }

    const creatMerchantApiAdd = () => {
        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), merchantName);

        const dataToSend = {
            name: replacedMerchantName,
            countryCode: countryCode,
            primaryPhone: storePhone,
            logo: logo,
            coverImage: coverImage,
            address: address,
            urlWebsite: webAddress,
            location: {
                lat: Number(lat) || 0,
                lng: Number(lng) || 0
            },
            city: city,
            schedule: schedule,
            description: description,
            serviceType: services,
            categoryIds: category.map((el) => el.id),
            bankAccountNumber: rib,
            ICE: ice,
            RC: rc,
            socialMedia: selectedPlatforms?.map(({ image, ...rest }) => rest),
            keywords: keywords,
            reimburseFrequency: reimbursementTime,
            commission: rate,
            cashbackRate: cashbackRate / 100,
            notifyPhones: [],
            usersIds: ownerId.map((el) => el.id)
        }

        if (!id && ownerId?.length < 1) {
            dataToSend.user = {
                firstName: firstName,
                lastName: lastName,
                countryCode: ownerCountryCode,
                phoneNumber: merchantPhone,
                email: userEmail.toLowerCase(),
                password: password,
                confirmPassword: password
            };
        }

        const newNotification = [...notifications]

        if (notifyPhones1 !== "") {
            newNotification[0] = notifyPhones1
            dataToSend.notifyPhones = newNotification
        }

        if (email?.length > 0) {
            dataToSend.email = email?.toLowerCase()
        }

        if (notifyPhones2 !== "") {
            newNotification[1] = notifyPhones2
            dataToSend.notifyPhones = newNotification
        }

        setloading(true)

        axiosMerchant.post(`/merchants`, dataToSend)
            .then((res) => {
                if (res?.response?.data?.error?.statusCode === 406) {
                    toast(res?.response?.data?.error?.message, {
                        theme: "colored",
                        type: "error",
                    });
                    setNumberUsedDialog(false)
                } else if (res?.response?.data?.error?.statusCode === 409) {
                    toast(formatMessage({ id: "merchants.ownerexists" }), {
                        theme: "colored",
                        type: "error",
                    });
                } else if (res?.response?.data?.error) {
                    toast("An error occured", {
                        theme: "colored",
                        type: "error",
                    });
                } else {
                    toast(formatMessage({ id: "merchants.create.success" }), {
                        theme: "colored",
                        type: "success",
                    });
                    navigate("/merchants")
                }
                setloading(false)
            })
            .catch((err) => {
                setloading(false)
            })
    }

    const creatMerchantApiEdit = () => {
        const replacements = [['’', "'"], ['`', "'"], ['‘', "'"]];
        const replacedMerchantName = replacements.reduce((acc, [pattern, replacement]) => acc.replace(new RegExp(pattern, 'g'), replacement), merchantName);

        const dataToSend = {
            name: replacedMerchantName,
            countryCode: countryCode,
            primaryPhone: storePhone,
            logo: logo,
            coverImage: coverImage,
            address: address,
            urlWebsite: webAddress,
            location: {
                lat: Number(lat) || 0,
                lng: Number(lng) || 0
            },
            city: city,
            schedule: schedule,
            description: description,
            serviceType: services,
            categoryIds: category.map((el) => el.id),
            bankAccountNumber: rib,
            ICE: ice,
            RC: rc,
            socialMedia: selectedPlatforms?.map(({ image, ...rest }) => rest),
            keywords: keywords,
            reimburseFrequency: reimbursementTime,
            commission: rate,
            cashbackRate: cashbackRate / 100,
            notifyPhones: [],
            usersIds: ownerId.map((el) => el.id)
        }

        const newNotification = [...notifications]

        if (notifyPhones1 !== "") {
            newNotification[0] = notifyPhones1
            dataToSend.notifyPhones = newNotification
        }

        if (email?.length > 0) {
            dataToSend.email = email?.toLowerCase()
        }

        if (notifyPhones2 !== "") {
            newNotification[1] = notifyPhones2
            dataToSend.notifyPhones = newNotification
        }

        if (id && hadOwner && ownerId?.length < 1) {
            toast("Select at least one owner", {
                theme: "colored",
                type: "error",
            });
            return
        }
        setloading(true)

        axiosMerchant.patch(`/merchants/${id}`, dataToSend)
            .then((res) => {
                setloading(false)
                if (res?.response?.data?.error?.statusCode === 406) {
                    toast(res?.response?.data?.error?.message, {
                        theme: "colored",
                        type: "error",
                    });
                } else if (res?.response?.data?.error) {
                    toast("An error occured", {
                        theme: "colored",
                        type: "error",
                    });
                } else {
                    toast(formatMessage({ id: "merchants.create.updatesuccess" }), {
                        theme: "colored",
                        type: "success",
                    });
                    navigate("/merchants")
                }
            })
            .catch((error) => {
                setloading(false)
                toast(error?.response?.data?.message, {
                    position: "top-right",
                    type: "error",
                    theme: "colored",
                });
            })
    }

    // Get merchant data by ID
    useEffect(() => {
        if (id) {
            setEditLoading(true)

            axiosMerchant.get(`/merchants/${id}`, {
                params: {
                    filter: {
                        include: [
                            {
                                relation: "transactions",
                                scope: {
                                    limit: 5,
                                    order: ["createdAt DESC"]
                                }
                            },
                            {
                                relation: "users",
                            },
                            {
                                relation: "reimbursements",
                                scope: {
                                    limit: 5,
                                    order: ["createdAt DESC"]
                                }
                            },
                            {
                                relation: "categories",
                            }
                        ]
                    }
                }
            })
                .then((res) => {
                    if (res?.response?.data?.error) {
                        setNotFound(true)
                    } else {
                        setUserDate(res?.data)
                        setStatus(res?.data?.isEnable)
                        setLogo(res?.data?.logo)
                        setCoverImage(res?.data?.coverImage)
                        setQrcode(res?.data)
                        setMerchantName(res?.data?.name)
                        setRib(res?.data?.bankAccountNumber)
                        setIce(res?.data?.ICE)
                        setRc(res?.data?.RC)
                        setSelectedPlatforms(res?.data?.socialMedia ? res?.data?.socialMedia?.map(item => ({ provider: item.provider, url: item.url, image: socialMediaOptions?.find(fd => item.provider === fd?.provider)?.image })) : []);
                        setAvailableOptions(res?.data?.socialMedia ? socialMediaOptions.filter(option =>
                            !res?.data?.socialMedia?.map(item => ({ provider: item.provider, url: item.url }))?.some(selected => selected.provider.toLowerCase() === option.provider.toLowerCase())
                        ) : socialMediaOptions);
                        setKeywords(res?.data?.keywords?.map(el => ({ id: el?.id, name: el?.name, isVisible: el?.isVisible === undefined ? false : el?.isVisible })) || [])
                        setHadEmail(res?.data?.email?.length > 0 && true)
                        setEmail(res?.data?.email)
                        setAddress(res?.data?.address)
                        setWebAddress(res?.data?.urlWebsite)
                        setLng(res?.data?.location?.lng)
                        setLat(res?.data?.location?.lat)
                        setStorePhone(res?.data?.primaryPhone)
                        setNotifyPhones1(res?.data?.notifyPhones[0] ? res?.data?.notifyPhones[0] : "")
                        setNotifyPhones2(res?.data?.notifyPhones[1] ? res?.data?.notifyPhones[1] : "")
                        setNotifications(res?.data?.notifyPhones)
                        setCountryCode(res?.data?.countryCode)
                        setCity(res?.data?.city)
                        if (res?.data?.users?.length > 0) {
                            setHadOwner(true)
                        }
                        setOwnerId(res?.data?.users?.filter((ft) => ft?.role === "owner" || ft?.role === "merchant_viewer")?.map((el) => {
                            return {
                                name: `${el?.firstName} ${el?.lastName}`, id: el?.id
                            }
                        }));
                        setServices(res?.data?.serviceType)
                        setCategory(res?.data?.categories ? res?.data?.categories : [])
                        setReimbursementTime(res?.data?.reimburseFrequency)
                        setRate(res?.data?.commission)
                        setCashbackRate(res?.data?.cashbackRate ? res?.data?.cashbackRate * 100 : 0)
                        setDescription(res?.data?.description)
                        setStartTime(dayjs(res?.data?.schedule?.opens))
                        setEndTime(dayjs(res?.data?.schedule?.closes))
                        if (res?.data?.schedule) {
                            setSchedule(
                                res?.data?.schedule?.map((el) => {
                                    return {
                                        isOpen: el?.isOpen, day: el?.day, openAt: el?.openAt, closeAt: el?.closeAt
                                    }
                                })
                            )
                            setDays(res?.data?.schedule?.map((el) => {
                                return {
                                    label: el?.day === "mon" ? "M" : el?.day === "tue" ? "T" : el?.day === "wed" ? "W" : el?.day === "thu" ? "T" : el?.day === "fri" ? "F" : "S",
                                    string: el?.day === "mon" ? "merchants.create.monday" : el?.day === "tue" ? "merchants.create.tuesday" : el?.day === "wed" ? "merchants.create.wednesday" : el?.day === "thu" ? "merchants.create.thursday" : el?.day === "fri" ? "merchants.create.friday" : el?.day === "sat" ? "merchants.create.saturday" : "merchants.create.sunday",
                                    isOpen: el?.isOpen, value: el?.day, openAt: el?.openAt, closeAt: el?.closeAt
                                }
                            }))
                        }
                    }
                    setEditLoading(false)
                })
                .catch((error) => {
                    setEditLoading(false)
                })
        }
    }, [])

    const onDeleteMerchant = () => {
        setDeleteLoading(true)

        axiosMerchant.delete(`/merchants/${id}`)
            .then((res) => {
                setDeleteLoading(false)
                setOpenDelete(false)
                if(res?.response?.data?.error){
                    toast(res?.response?.data?.error?.message, {
                        theme: "colored",
                        type: "error",
                    });
                } else {
                    toast(formatMessage({ id: "merchants.create.deletesuccess" }), {
                        theme: "colored",
                        type: "success",
                    });
                    navigate("/merchants")
                }
            })
            .catch((error) => {
                setDeleteLoading(false)
            })
    }

    const changeStatus = () => {
        setStatusLoading(true)

        axiosMerchant.get(`/toggle-merchant-status/${id}`)
            .then((res) => {
                setStatusLoading(false)
                toast(res?.data?.message, {
                    theme: "colored",
                    type: "success",
                });
                setStatus(!status)
            })
            .catch((error) => {
                setStatusLoading(false)
            })
    }

    //Get categories
    useEffect(() => {
        setLoad(true)
        const filterCategories = {
            ...(({ order: `${"createdAt"} ${"DESC"} ` }) || {}),
        };

        axiosMerchant.get(`/categories`, {
            params: {
                filter: {
                    ...filterCategories,
                    fields: {
                        name: true,
                        id: true
                    }
                }
            }
        })
            .then((res) => {
                setCat(res?.data)
                setLoad(false)
            })
            .catch((error) => {
                setLoad(false)
            })
    }, [])

    // Get owners
    useEffect(() => {
        axiosMerchant.get(`/owners`, {
            params: {
                filter: {
                    fields: {
                        firstName: true,
                        lastName: true,
                        id: true,
                        role: true
                    }
                }
            }
        })
            .then((res) => {
                setOwners(res?.data?.docs)
            })
            .catch((error) => {
            })
    }, [])

    //Select all categories
    const handleToggleSelectAll = (cat) => {
        setIsCheckAll(!isCheckAll);
        setSearchCat("");
        setCategory(cat.map((el) => { return { name: el?.name, id: el?.id } }));
        if (isCheckAll) {
            setCategory([]);
        }
    };

    //Select category
    const handleSelectCat = (data) => {
        if (category.filter((ft) => ft?.id === data?.id)?.length > 0) {
            setCategory(category.filter((item) => item?.id !== data?.id));
        } else {
            setCategory((prev) => [...prev, { name: data?.name, id: data?.id }]);
        }
    };

    //Select owner
    const handleSelectOwner = (data) => {
        if (ownerId.filter((ft) => ft?.id === data?.id)?.length > 0) {
            setOwnerId(ownerId.filter((item) => item?.id !== data?.id));
        } else {
            setOwnerId((prev) => [...prev, { name: `${data?.firstName} ${data?.lastName}`, id: data?.id }]);
        }
    };

    //Upload image from project directory
    const imageToBlob = async (imageUrl) => {
        if (imageUrl === "") {
            return
        } else {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return new File([blob], 'imageFileName.jpg', { type: 'image/jpeg' });
        }
    };

    //Upload image into bucket and get image path
    const uploadImage = async (id) => {
        const img = await imageToBlob(
            id === "65a13e8ec4af018361d98b9d" || id === "65a903c8cb1a4d3aa6b1604e" ? restaurant :
                id === "65a13e8ec4af01126cd98b9e" || id === "65a903c8cb1a4d1aedb1604f" ? appliance :
                    id === "65a13e8ec4af018090d98b9f" || id === "65a903c8cb1a4d82fbb16050" ? health :
                        id === "65a13e8ec4af013ce6d98ba0" || id === "65a903c8cb1a4d03dfb16051" ? beauty :
                            id === "65a13e8ec4af010170d98ba1" || id === "65a903c8cb1a4d25cfb16052" ? hobbies :
                                id === "65a13e8ec4af0131f1d98ba3" || id === "65a903c8cb1a4d0864b16054" ? accessories :
                                    id === "65a13e8ec4af017ac9d98baa" || id === "65a903c8cb1a4d6bdab1605b" ? chocolate :
                                        id === "65a13e8ec4af01803fd98ba6" || id === "65a903c8cb1a4d639cb16057" ? transport :
                                            id === "65a13e8ec4af011462d98bac" || id === "65a903c8cb1a4d2478b1605d" ? market :
                                                id === "65cb6b7e2fa6387e25a55c1f" ? carpart :
                                                    id === "65c9e4e66744a41b5ef91cbe" ? tech :
                                                        id === "65c5f8d26744a4ebcef91cb3" ? fitness :
                                                            id === "65c5f8cb6744a4d689f91cb2" ? gaming : ""
        );

        if (img === "" || img === undefined) {
            return;
        } else {
            setCoverLoad(true)
            let url = `${import.meta.env.VITE_MERCHANT_BASE_URL}/api/`;

            FileUploadService.upload(img, url)
                .then((response) => {
                    setCoverImage(response?.data?.path)
                    setCoverLoad(false)
                })
                .catch((error) => {
                    setCoverLoad(false)
                });
        }
    };

    const sortCities = (a, b) => {
        if (a?.city?.toLowerCase() < b?.city?.toLowerCase()) return -1;
        if (a?.city?.toLowerCase() > b?.city?.toLowerCase()) return 1;
        return 0;
    };

    const sortOwners = (a, b) => {
        if (a?.firstName?.toLowerCase() < b?.firstName?.toLowerCase()) return -1;
        if (a?.firstName?.toLowerCase() > b?.firstName?.toLowerCase()) return 1;
        return 0;
    };

    const removeKeyword = (indexToRemove) => {
        setKeywords((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
    }

    return (
        <Box>
            {id && editLoading ?
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <PageSpinner />
                </Box> :
                notFound ?
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", height: "50vh" }}>
                        <Typography textAlign={"center"} sx={{ marginTop: "2rem", fontSize: "1.2rem" }}>
                            {formatMessage({ id: "employee.norecordsuser" })}
                        </Typography>
                    </Box> :
                    <>{coverLoad ?
                        <Box sx={{
                            width: '100%',
                            height: { xs: '12rem' },
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end"
                        }}>
                            <PageSpinner />
                        </Box> :
                        <Box
                            sx={{
                                backgroundImage: `url(${coverImage?.length < 1 ? cover : coverImage})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                width: '100%',
                                height: { xs: '16rem' },
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "end"
                            }}>
                            <IconButton
                                onClick={() => setOpenPicUpload({ type: "coverImage", state: true })}
                                sx={{
                                    width: "2rem",
                                    height: "2rem",
                                    bgcolor: '#fff',
                                    marginRight: "25px",
                                    marginTop: "25px",
                                    ':hover': { bgcolor: 'var(--color-cyan)' }
                                }}><EditOutlined sx={{ fontSize: '1.5rem', color: '#000' }} />
                            </IconButton>

                            {id &&
                                <Box sx={{ marginRight: "25px", marginBottom: "25px" }}>
                                    {statusLoading ?
                                        <CircularProgress
                                            size={25}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "#fff"
                                            }}
                                        /> :
                                        <Tooltip title={status ? formatMessage({ id: "merchants.create.deactivatemerchant" }) : formatMessage({ id: "merchants.create.activatemerchant" })}>
                                            <Box>
                                                <IOSSwitch
                                                    id="active"
                                                    checked={status}
                                                    onClick={() => { changeStatus() }}
                                                />
                                            </Box>
                                        </Tooltip>
                                    }
                                </Box>}
                        </Box>}
                        <Box sx={{ display: "flex", justifyContent: "center", mb: '1.5rem' }}>
                            <Avatar src={logo?.length < 1 ? "" : logo} sx={{ width: 86, height: 86, marginTop: "-2.5rem" }} />
                            <IconButton
                                onClick={() => setOpenPicUpload({ type: "logo", state: true })}
                                sx={{
                                    width: "2rem",
                                    height: "2rem",
                                    bgcolor: '#fff',
                                    marginTop: "-2.5rem",
                                    marginLeft: "-1rem",
                                    ':hover': { bgcolor: 'var(--color-cyan)' }
                                }}><EditOutlined sx={{ fontSize: '1.5rem', color: '#000' }} />
                            </IconButton>
                        </Box>

                        {qrcode?.qrCode?.length > 0 &&
                            <Box sx={{ display: "flex", justifyContent: "end", marginTop: "-3rem" }}>
                                <Tooltip title={formatMessage({ id: "merchants.qrcode" })}>
                                    <IconButton onClick={() => setOpenqr({ data: qrcode, state: true })} sx={{ backgroundColor: "#CCCCCC" }}>
                                        <QrCode2 />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        }

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="name"
                                    fullWidth
                                    label={<span>{formatMessage({ id: "merchants.merchantname" })}<span style={{ color: "red" }}>*</span></span>}
                                    size="small"
                                    margin="dense"
                                    value={merchantName}
                                    error={merchantName?.length > 0 ? false : error}
                                    onChange={(e) => { setMerchantName(e.target.value); setError(false) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="rib"
                                    fullWidth
                                    label={"RIB"}
                                    size="small"
                                    inputProps={{ maxLength: 24 }}
                                    margin="dense"
                                    value={rib}
                                    onChange={(e) => setRib(!Number.isNaN(Number(e.target.value)) ? e.target.value : value)}
                                    error={rib?.length > 0 && !ribNumberRegex.test(`${rib}`)}
                                    helperText={
                                        rib?.length > 0 && !ribNumberRegex.test(`${rib}`) &&
                                        formatMessage({ id: "common.invalid_rib" })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="email"
                                    fullWidth
                                    label={id && hadEmail > 0 ? <span>Email<span style={{ color: "red" }}>*</span></span> : "Email"}
                                    size="small"
                                    margin="dense"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={(id && hadEmail && email?.length < 1) || (email?.length > 0 && !isEmail(`${email}`)) ? error : email?.length < 1 ? false : ((email?.length > 0 && !isEmail(`${email}`)) ? error : false)}
                                    helperText={
                                        email?.length > 0 && !isEmail(`${email}`) &&
                                        formatMessage({ id: "common.invalid_email" })
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <Autocomplete
                                    id="city"
                                    sx={{
                                        "& .MuiFormControl-root": {
                                            marginTop: ".47rem"
                                        },
                                        "& fieldset": { border: "none" },
                                        // "& .MuiSvgIcon-root": { display: "none" }
                                    }}
                                    value={id && cities?.filter((ft) => ft?.city === city)[0]}
                                    size="small"
                                    InputLabelProps={{ shrink: false }}
                                    fullWidth
                                    options={cities.sort(sortCities)}
                                    getOptionLabel={(option) => `${option?.city}`}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<span>{formatMessage({ id: "merchants.city" })}<span style={{ color: "red" }}>*</span></span>}
                                        />
                                    )}
                                    onChange={(_, value, reason) => {
                                        if (reason === "clear") {
                                            setCity("");
                                            setError(false)
                                            return;
                                        } else {
                                            setCity(value?.city);
                                            setError(false)
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    select
                                    id="services"
                                    size="small"
                                    label={<span>Services<span style={{ color: "red" }}>*</span></span>}
                                    fullWidth
                                    sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                    value={services}
                                    error={services?.length > 0 ? false : error}
                                    onChange={(e) => { setServices(e.target.value); setError(false) }}
                                >
                                    <MenuItem onClick={() => setWebAddress("")} value={"In-place"}>{formatMessage({ id: "merchants.inplace" })}</MenuItem>
                                    <MenuItem onClick={() => setWebAddress("")} value={"Delivery"}>{formatMessage({ id: "merchants.delivery" })}</MenuItem>
                                    <MenuItem onClick={() => setWebAddress("")} value={"In-place & Delivery"}>{formatMessage({ id: "merchants.inplaceanddelivery" })}</MenuItem>
                                    <MenuItem onClick={() => setWebAddress("")} value={"In-App"}>{formatMessage({ id: "merchants.inapp" })}</MenuItem>
                                    <MenuItem onClick={() => { setAddress(""); setLng(""); setLat("") }} value={"External"}>{formatMessage({ id: "merchants.external" })}</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <BasicSelect
                                    size="small"
                                    margin="dense"
                                    formControlProps={{ fullWidth: true, margin: "dense" }}
                                    label={<span>{formatMessage({ id: "employee.country" })}<span style={{ color: "red" }}>*</span></span>}
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    {supportedCountries.map((country, i) => (
                                        <MenuItem key={i} value={country.dial_code}>
                                            {" "}
                                            {country.flag}
                                            {` ${country.code}`}
                                            {` (${country.dial_code})`}
                                        </MenuItem>
                                    ))}
                                </BasicSelect>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    id="store_phone"
                                    fullWidth
                                    label={<span>{formatMessage({ id: "merchants.create.storenumber" })}<span style={{ color: "red" }}>*</span></span>}
                                    size="small"
                                    margin="dense"
                                    value={storePhone}
                                    onChange={(e) => { setStorePhone(!Number.isNaN(Number(e.target.value)) ? e.target.value : storePhone); setError(false) }}
                                    error={(storePhone?.length > 0 && !phoneNumberRegex.test(`${ownerCountryCode}${storePhone}`)) ? true : storePhone?.length < 1 ? error : storePhone[0] === "0" ? true : false}
                                    helperText={
                                        storePhone[0] === "0" ? formatMessage({ id: "merchants.owner.startzero" }) :
                                            storePhone?.length > 0 && !phoneNumberRegex.test(`${ownerCountryCode}${storePhone}`) ?
                                                formatMessage({ id: "common.invalid_phone" }) : ""
                                    }
                                />
                            </Grid>

                            {services === "External" ?
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="web-address"
                                        fullWidth
                                        label={formatMessage({ id: "merchants.webaddress" })}
                                        size="small"
                                        margin="dense"
                                        value={webAddress}
                                        error={services === "External" && webAddress?.length > 0 && webAddressRegex.test(`${webAddress}`) ? false : services === "External" && webAddress?.length > 0 && !webAddressRegex.test(`${webAddress}`) ? true : error}
                                        onChange={(e) => { setWebAddress(e.target.value); setError(false) }}
                                        helperText={
                                            services === "External" && webAddress?.length > 0 && !webAddressRegex.test(`${webAddress}`) ?
                                                "eg: www.example.com" : ""
                                        }
                                    />
                                </Grid> :
                                <>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            id="address"
                                            fullWidth
                                            label={formatMessage({ id: "company.address" })}
                                            size="small"
                                            margin="dense"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <TextField
                                                id="lng"
                                                size="small"
                                                label={"Longitude"}
                                                fullWidth
                                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                                value={lng}
                                                onChange={(e) => setLng(!Number.isNaN(Number(e.target.value)) || e.target.value === "-" ? e.target.value : value)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position='end'>
                                                        <Place />
                                                    </InputAdornment>
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <TextField
                                                id="lat"
                                                size="small"
                                                label={"Latitude"}
                                                fullWidth
                                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                                value={lat}
                                                onChange={(e) => setLat(!Number.isNaN(Number(e.target.value)) || e.target.value === "-" ? e.target.value : value)}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position='end'>
                                                        {/* <Tooltip title={formatMessage({ id: "merchants.create.picklocation" })} arrow> */}
                                                        <Place
                                                        // onClick={() => setOpenMap(true)} 
                                                        // sx={{ cursor: "pointer" }}
                                                        />
                                                        {/* </Tooltip> */}
                                                    </InputAdornment>
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </>
                            }

                            <Grid item xs={12} sm={3}>
                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel>
                                        {<span>{formatMessage({ id: "merchants.category" })}<span style={{ color: "red" }}>*</span></span>}
                                    </InputLabel>
                                    <Select
                                        id="category"
                                        size='small'
                                        multiple
                                        value={category}
                                        error={category?.length < 1 ? error : false}
                                        input={<OutlinedInput id="select-multiple-chip" label={formatMessage({ id: "merchants.category" })} />}
                                        renderValue={(selected) => (
                                            <Tooltip title={<Box sx={{ display: "flex", gap: .5, flexWrap: "wrap" }}>{selected?.map((el) => { return <span key={el?.id}>{el?.name},</span> })}</Box>}>
                                                <Box sx={{ display: "flex", flexWrap: "nowrap", overflow: "hidden", gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip sx={{ height: "20px" }} key={value?.id} label={value?.name} onDelete={() => handleSelectCat(value)} onMouseDown={(event) => { event.stopPropagation() }} />
                                                    ))}
                                                </Box>
                                            </Tooltip>
                                        )}
                                        MenuProps={MenuProps}
                                        sx={{
                                            width: "100%",
                                            marginTop: ".47rem",
                                            backgroundColor: "#F7F0F0"
                                        }}
                                    >
                                        {load ? (
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <CircularProgress
                                                    size={20}
                                                    sx={{
                                                        color: "var(--color-dark-blue) !important",
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Box>
                                                <MenuItem onClick={() => handleToggleSelectAll(cat)}>
                                                    <Checkbox checked={isCheckAll} sx={{ paddingLeft: "0" }} />
                                                    {isCheckAll ? (
                                                        <>{formatMessage({ id: "edoc.unselectall" })}</>
                                                    ) : (
                                                        <>{formatMessage({ id: "edoc.selectall" })}</>
                                                    )}
                                                </MenuItem>
                                                <MenuItem>
                                                    <TextField
                                                        size="small"
                                                        variant="standard"
                                                        value={searchCat}
                                                        onChange={(e) => setSearchCat(e.target.value)}
                                                        fullWidth
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                background: "#fff",
                                                                borderRadius: "50px",
                                                            },
                                                            "& fieldset": { border: "none" },
                                                            "& .MuiFormLabel-root": {
                                                                color: "var(--color-dark-blue) !important",
                                                                fontWeight: "600",
                                                                fontSize: "15px",
                                                                textTransform: "capitalize",
                                                            },
                                                        }}
                                                        placeholder={formatMessage({ id: "nav.search" })}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Search />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </MenuItem>
                                                <Divider />
                                                {cat.filter((el) =>
                                                    el?.name
                                                        ?.toLocaleLowerCase()
                                                        .includes(searchCat.toLocaleLowerCase())
                                                )?.length < 1 ? <Box sx={{ textAlign: "center" }}>{formatMessage({ id: "advance.norecords" })}</Box> :
                                                    cat.filter((el) =>
                                                        el?.name
                                                            ?.toLocaleLowerCase()
                                                            .includes(searchCat.toLocaleLowerCase())
                                                    )
                                                        .map((el) => (
                                                            <MenuItem
                                                                key={el?.id}
                                                                value={el?.name}
                                                                title={el?.name}
                                                                onClick={() => { handleSelectCat(el); uploadImage(el?.id) }}
                                                                sx={{ textTransform: "capitalize" }}
                                                            >
                                                                <Checkbox
                                                                    checked={category?.filter((ft) => ft?.id === el?.id).length > 0}
                                                                    sx={{ paddingLeft: "0" }}
                                                                />
                                                                {el?.name}
                                                            </MenuItem>
                                                        ))}
                                            </Box>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    select
                                    id="reimbursement"
                                    size="small"
                                    label={<span>{formatMessage({ id: "merchants.reimbursementtime" })}<span style={{ color: "red" }}>*</span></span>}
                                    fullWidth
                                    sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                    value={reimbursementTime}
                                    error={reimbursementTime?.length > 0 ? false : error}
                                    onChange={(e) => { setReimbursementTime(e.target.value); setError(false) }}
                                >
                                    <MenuItem value={"Daily"}>{formatMessage({ id: "merchants.daily" })}</MenuItem>
                                    <MenuItem value={"Weekly"}>{formatMessage({ id: "merchants.weekly" })}</MenuItem>
                                    <MenuItem value={"Bi-Weekly"}>{formatMessage({ id: "merchants.biweekly" })}</MenuItem>
                                    <MenuItem value={"Monthly"}>{formatMessage({ id: "merchants.monthly" })}</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <MerchantSlider
                                    id="slider"
                                    size="medium"
                                    aria-label="Small"
                                    label={formatMessage({ id: "merchants.reimbursementrate" })}
                                    valueLabelDisplay="auto"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value) > 100 ? 100 : Number(e.target.value))}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <MerchantSlider
                                    id="slider"
                                    size="medium"
                                    aria-label="Small"
                                    label={formatMessage({ id: "merchants.cashbackrate" })}
                                    valueLabelDisplay="auto"
                                    value={cashbackRate}
                                    onChange={(e) => setCashbackRate(Number(e.target.value) > 100 ? 100 : Number(e.target.value))}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    id="ice"
                                    fullWidth
                                    label={"ICE"}
                                    size="small"
                                    margin="dense"
                                    value={ice}
                                    onChange={(e) => setIce(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    id="rc"
                                    fullWidth
                                    label={"RC"}
                                    size="small"
                                    margin="dense"
                                    value={rc}
                                    onChange={(e) => setRc(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl sx={{ width: "100%" }}>
                                    <InputLabel>
                                        {formatMessage({ id: "merchants.create.owner" })}
                                    </InputLabel>
                                    <Select
                                        id="owners"
                                        size='small'
                                        multiple
                                        value={ownerId}
                                        error={ownerId?.length < 1 ? error : false}
                                        input={<OutlinedInput id="select-multiple-chip" label={formatMessage({ id: "merchants.category" })} />}
                                        renderValue={(selected) => (
                                            <Tooltip title={<Box sx={{ display: "flex", gap: .5, flexWrap: "wrap" }}>{selected?.map((el, index) => { return <span key={index}>{el?.name},</span> })}</Box>}>
                                                <Box sx={{ display: "flex", flexWrap: "nowrap", overflow: "hidden", gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip sx={{ height: "25px", '& .MuiChip-deleteIcon': { fontSize: "20px" } }} key={value?.id} label={value?.name} onDelete={() => handleSelectOwner(value)} onMouseDown={(event) => { event.stopPropagation() }} />
                                                    ))}
                                                </Box>
                                            </Tooltip>
                                        )}
                                        MenuProps={MenuProps}
                                        sx={{
                                            width: "100%",
                                            marginTop: ".47rem",
                                            backgroundColor: "#F7F0F0"
                                        }}
                                    >
                                        {load ? (
                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <CircularProgress
                                                    size={20}
                                                    sx={{
                                                        color: "var(--color-dark-blue) !important",
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Box>
                                                {id &&
                                                    <MenuItem sx={{ display: "flex", justifyContent: "end" }}>
                                                        <Button
                                                            onClick={() => navigate("/add-owner", { state: { id } })}
                                                            variant="outlined"
                                                            sx={{
                                                                textTransform: "none",
                                                                color: "#000",
                                                                borderColor: "gray !important",
                                                                fontWeight: "600",
                                                                padding: "1px 8px",
                                                            }}
                                                        >
                                                            {formatMessage({ id: "merchants.create.addnewownertoexistingmerchant" })}
                                                        </Button>
                                                    </MenuItem>
                                                }
                                                <MenuItem>
                                                    <TextField
                                                        size="small"
                                                        variant="standard"
                                                        value={searchOwner}
                                                        onChange={(e) => setSearchOwner(e.target.value)}
                                                        fullWidth
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                background: "#fff",
                                                                borderRadius: "50px",
                                                            },
                                                            "& fieldset": { border: "none" },
                                                            "& .MuiFormLabel-root": {
                                                                color: "var(--color-dark-blue) !important",
                                                                fontWeight: "600",
                                                                fontSize: "15px",
                                                                textTransform: "capitalize",
                                                            },
                                                        }}
                                                        placeholder={formatMessage({ id: "nav.search" })}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Search />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </MenuItem>
                                                <Divider />
                                                {owners.filter((item) =>
                                                    `${item?.firstName} ${item?.lastName}`
                                                        ?.toLocaleLowerCase()
                                                        .includes(searchOwner.toLocaleLowerCase())
                                                )?.length < 1 ? <Box sx={{ textAlign: "center" }}>{formatMessage({ id: "advance.norecords" })}</Box> :
                                                    owners?.filter((item) =>
                                                        `${item?.firstName} ${item?.lastName}`
                                                            ?.toLocaleLowerCase()
                                                            .includes(searchOwner.toLocaleLowerCase())
                                                    )?.sort(sortOwners)
                                                        .map((el) => (
                                                            <MenuItem
                                                                key={el?.id}
                                                                value={el?.id}
                                                                onClick={() => { handleSelectOwner(el) }}
                                                                sx={{ textTransform: "capitalize" }}
                                                            >
                                                                <Checkbox
                                                                    checked={ownerId?.filter((ft) => ft?.id === el?.id).length > 0}
                                                                    sx={{ paddingLeft: "0" }}
                                                                />
                                                                {`${el?.firstName} ${el?.lastName}`}
                                                                <span style={{ color: "gray", marginLeft: "5px" }}>{`(${el?.role === "renderer" ? formatMessage({ id: "merchants.owner.viewer" }) : el?.role})`}</span>
                                                            </MenuItem>
                                                        ))}
                                            </Box>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* <Grid item xs={12} sm={6}>
                            <TextField
                                id="notify_phone1"
                                fullWidth
                                label={formatMessage({ id: "merchants.create.notifyphone" })}
                                size="small"
                                margin="dense"
                                value={notifyPhones1}
                                onChange={(e) => { setNotifyPhones1(!Number.isNaN(Number(e.target.value)) || e.target.value === "+" ? e.target.value : value); setError(false) }}
                                error={notifyPhones1?.length > 0 && (notifyPhones1[0] !== "+" || notifyPhones1?.length < 11)}
                                helperText={
                                    notifyPhones1?.length > 0 && notifyPhones1[0] !== "+" ?
                                        formatMessage({ id: "merchants.create.addcode" }) :
                                        notifyPhones1?.length > 0 && notifyPhones1?.length < 11 &&
                                        formatMessage({ id: "merchants.create.numberlength" })
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <NotificationsNoneOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="notify_phone2"
                                fullWidth
                                label={formatMessage({ id: "merchants.create.notifyphone" }) + " 2"}
                                size="small"
                                margin="dense"
                                value={notifyPhones2}
                                onChange={(e) => { setNotifyPhones2(!Number.isNaN(Number(e.target.value)) || e.target.value === "+" ? e.target.value : value); setError(false) }}
                                error={notifyPhones2?.length > 0 && (notifyPhones2[0] !== "+" || notifyPhones2?.length < 11)}
                                helperText={
                                    notifyPhones2?.length > 0 && notifyPhones2[0] !== "+" ?
                                        formatMessage({ id: "merchants.create.addcode" }) :
                                        notifyPhones2?.length > 0 && notifyPhones2?.length < 11 &&
                                        formatMessage({ id: "merchants.create.numberlength" })
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">
                                            <NotificationsNoneOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid> */}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="description"
                                    size="small"
                                    label={formatMessage({ id: "edoc.description" })}
                                    fullWidth
                                    sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" } }}
                                    value={description}
                                    onChange={(e) => { description?.length > 2900 ? "" : setDescription(e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} mt={1}>
                                <Box sx={{ height: "40px", backgroundColor: "var(--color-white)", padding: "0 16px" }}>
                                    <Typography sx={{ fontSize: "12.5px", color: "var(--color-dark-blue)", position: "relative", top: "-25%" }}>
                                        {formatMessage({ id: "merchants.weekdaysavailability" })}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: 2, marginTop: "-.5rem" }}>
                                        {days?.map((el, index) => {
                                            return (
                                                <Box
                                                    key={index}
                                                    onClick={() => getAvailableDays(el, "", "")}
                                                    sx={{
                                                        borderRadius: "50%",
                                                        cursor: "pointer",
                                                        width: "1.6rem",
                                                        height: "1.6rem",
                                                        border: "1px solid var(--color-dark-blue)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        userSelect: "none",
                                                        color: schedule?.filter((ft) => ft?.day === el?.value)[0]?.isOpen === "true" ? "#fff" : "var(--color-dark-blue)",
                                                        backgroundColor: schedule?.filter((ft) => ft?.day === el?.value)[0]?.isOpen === "true" ? "var(--color-dark-blue)" : "#fff"
                                                    }}
                                                >
                                                    {el?.label}
                                                </Box>
                                            )
                                        })}

                                        <img
                                            onClick={() => setOpenAvailability(true)}
                                            style={{ cursor: "pointer" }}
                                            width={27}
                                            src={"/icons/editavailability.svg"}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} mt={1}>
                                <Box sx={{ height: "40px", backgroundColor: "var(--color-white)", padding: "0 16px" }}>
                                    <Typography sx={{ fontSize: "13px", color: "var(--color-dark-blue)", position: "relative", top: "-25%" }}>
                                        {formatMessage({ id: "merchants.socialmedia" })}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, marginTop: "-.5rem" }}>
                                        <span style={{ display: "flex", gap: 10 }}>
                                            {socialMediaOptions?.filter((ft) => selectedPlatforms?.some(sm => sm?.provider === ft?.provider))?.length < 1 ?
                                                <Typography sx={{ fontSize: "13px", color: "var(--color-dark-blue)", }}>{formatMessage({ id: "merchants.socialaddlabel" })}</Typography> :
                                                socialMediaOptions?.filter((ft) => selectedPlatforms?.some(sm => sm?.provider === ft?.provider)).map((el, index) => {
                                                    return (
                                                        <img key={index} src={el?.image} alt={el?.provider} />
                                                    )
                                                })
                                            }
                                        </span>
                                        <img
                                            onClick={() => setOpenSocialMedia(true)}
                                            style={{ cursor: "pointer" }}
                                            width={27}
                                            src={"/icons/editavailability.svg"}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} mt={1}>
                                <Box sx={{ height: "40px", backgroundColor: "var(--color-white)", padding: "0 16px" }}>
                                    <Typography sx={{ fontSize: "13px", color: "var(--color-dark-blue)", position: "relative", top: "-25%" }}>
                                        {formatMessage({ id: "merchants.keywords" })}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, marginTop: "-.5rem" }}>
                                        <span style={{ display: "flex", gap: 10, overflow: "hidden", width: "100%" }}>
                                            {keywords?.length < 1 ?
                                                <Typography sx={{ fontSize: "13px", color: "var(--color-dark-blue)", }}>{formatMessage({ id: "merchants.keywordaddlabel" })}</Typography> :
                                                keywords?.map((el, index) => {
                                                    return (
                                                        <Box
                                                            key={index}
                                                            title={el?.name}
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                                backgroundColor: "var(--color-dark-blue)",
                                                                color: "#fff",
                                                                padding: "3px 9px",
                                                                borderRadius: "10px"
                                                            }}
                                                        >
                                                            <Typography
                                                                noWrap
                                                                sx={{
                                                                    fontSize: "14px",
                                                                    maxWidth: "180px"
                                                                }}
                                                            >
                                                                {el?.name}
                                                            </Typography>
                                                            <Close
                                                                onClick={() => removeKeyword(index)}
                                                                fontSize='12px'
                                                                sx={{ border: "1px solid #fff", borderRadius: "50%", cursor: "pointer" }}
                                                            />
                                                        </Box>
                                                    )
                                                })}
                                        </span>
                                        <img
                                            onClick={() => setOpenKeywords(true)}
                                            style={{ cursor: "pointer" }}
                                            width={27}
                                            src={"/icons/editavailability.svg"}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            <Grid item xs={12} />

                            {!id && ownerId?.length < 1 ?
                                <>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="firstname"
                                            size="small"
                                            label={<span>{formatMessage({ id: "merchants.create.ownerfirstname" })}<span style={{ color: "red" }}>*</span></span>}
                                            fullWidth
                                            sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                            value={firstName}
                                            onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                                            error={firstName?.length > 0 ? false : error}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="lastname"
                                            size="small"
                                            label={<span>{formatMessage({ id: "merchants.create.ownerlastname" })}<span style={{ color: "red" }}>*</span></span>}
                                            fullWidth
                                            sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                            value={lastName}
                                            onChange={(e) => { setLastName(e.target.value); setError(false) }}
                                            error={lastName?.length > 0 ? false : error}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="useremail"
                                            size="small"
                                            label={<span>{formatMessage({ id: "merchants.create.owneremail" })}<span style={{ color: "red" }}>*</span></span>}
                                            fullWidth
                                            sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            error={(userEmail?.length > 0 && !isEmail(`${userEmail}`) ? true : userEmail?.length < 1 ? error : false)}
                                            helperText={
                                                userEmail?.length > 0 && !isEmail(`${userEmail}`) &&
                                                formatMessage({ id: "common.invalid_email" })
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <TextField
                                                id="password"
                                                size="small"
                                                label={<span>{formatMessage({ id: "employee.password" })}<span style={{ color: "red" }}>*</span></span>}
                                                fullWidth
                                                sx={{ '&.MuiFormControl-root': { marginTop: ".47rem" }, backgroundColor: "#D9DFE9" }}
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setError(true) }}
                                                error={password?.length > 0 ? false : error}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position='end'>
                                                        <Tooltip title={formatMessage({ id: "merchants.create.generatepass" })} arrow>
                                                            <SettingsSuggestOutlined onClick={() => {
                                                                if (id) {

                                                                } else {
                                                                    setPassword(
                                                                        uid.rnd() +
                                                                        specialChar[Math.floor(Math.random() * specialChar.length)] +
                                                                        numbers[Math.floor(Math.random() * numbers.length)] +
                                                                        uppercase[Math.floor(Math.random() * uppercase.length)] +
                                                                        lowercase[Math.floor(Math.random() * lowercase.length)]
                                                                    )
                                                                }

                                                            }
                                                            } sx={{ cursor: "pointer" }} />
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }}
                                                disabled={id}
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={2}>
                                        <BasicSelectBlue
                                            size="small"
                                            margin="dense"
                                            formControlProps={{ fullWidth: true, margin: "dense" }}
                                            label={<span>{formatMessage({ id: "employee.country" })}<span style={{ color: "red" }}>*</span></span>}
                                            value={ownerCountryCode}
                                            onChange={(e) => setOwnerCountryCode(e.target.value)}
                                        >
                                            {supportedCountries.map((country, i) => (
                                                <MenuItem key={i} value={country.dial_code}>
                                                    {" "}
                                                    {country.flag}
                                                    {` ${country.code}`}
                                                    {` (${country.dial_code})`}
                                                </MenuItem>
                                            ))}
                                        </BasicSelectBlue>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="merchant_phone"
                                            fullWidth
                                            label={<span>{formatMessage({ id: "merchants.create.ownerphone" })}<span style={{ color: "red" }}>*</span></span>}
                                            size="small"
                                            margin="dense"
                                            sx={{ backgroundColor: "#D9DFE9" }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        <NotificationsNoneOutlined />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            value={merchantPhone}
                                            onChange={(e) => {
                                                setMerchantPhone(!Number.isNaN(Number(e.target.value)) ? e.target.value : value);
                                                setError(false)

                                            }}
                                            error={(merchantPhone?.length > 0 && !phoneNumberRegex.test(`${ownerCountryCode}${merchantPhone}`)) ? true : merchantPhone?.length < 1 ? error : merchantPhone[0] === "0" ? true : false}
                                            helperText={
                                                merchantPhone[0] === "0" ? formatMessage({ id: "merchants.owner.startzero" }) :
                                                    merchantPhone?.length > 0 && !phoneNumberRegex.test(`${ownerCountryCode}${merchantPhone}`) ?
                                                        formatMessage({ id: "common.invalid_phone" }) : ""
                                            }
                                        />
                                    </Grid>
                                </> : null
                            }

                            <Grid item xs={12} sm={id ? 0 : 2} />
                            <Grid item xs={12} sm={4} my={{ xs: 0, md: 3 }}>
                                <Button
                                    onClick={() => navigate("/merchants")}
                                    id="request-voucher"
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        color: "var(--color-dark-blue)",
                                        backgroundColor: "var(--color-cyan) !important",
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        border: "0 !important"
                                    }}
                                >
                                    {formatMessage({ id: "edoc.cancel" })}
                                </Button>
                            </Grid>
                            {id &&
                                <Grid item xs={12} sm={4} my={{ xs: 0, md: 3 }}>
                                    <Button
                                        onClick={() => setOpenDelete(true)}
                                        id="request-voucher"
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            color: "#fff",
                                            backgroundColor: "#FA3E3E !important",
                                            borderRadius: "20px",
                                            textTransform: "capitalize",
                                            fontWeight: "600",
                                            border: "0 !important",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {formatMessage({ id: "merchants.create.delete" })}
                                    </Button>
                                </Grid>
                            }
                            <Grid item xs={12} sm={4} my={{ xs: 0, md: 3 }}>
                                <Button
                                    onClick={() => createMerchant()}
                                    id="request-voucher"
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        color: "#fff",
                                        backgroundColor: "var(--color-dark-blue) !important",
                                        borderRadius: "20px",
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        border: "0 !important"
                                    }}
                                >
                                    {loading ?
                                        <CircularProgress
                                            size={25}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "#fff"
                                            }}
                                        /> : id ? formatMessage({ id: "merchants.create.update" }) : formatMessage({ id: "filter.add" })
                                    }
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={id ? 0 : 2} />
                        </Grid>

                        {/* Profile Image upload dialog */}
                        <Dialog
                            open={openPicUpload.state}
                            onClose={() => setOpenPicUpload({ type: "", state: false })}
                            fullWidth
                            maxWidth={openPicUpload.type === "logo" ? "xs" : "md"}
                        >
                            <UploadProfileImage
                                openPicUpload={openPicUpload}
                                setOpenPicUpload={setOpenPicUpload}
                                setLogo={setLogo}
                                setCoverImage={setCoverImage}
                                setProfileImage={setProfileImage}
                            />
                        </Dialog>

                        {/* Availability Dialog */}
                        <Dialog
                            open={openAvailability}
                            onClose={() => setOpenAvailability(false)}
                            fullWidth
                            sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
                            maxWidth={"sm"}
                        >
                            <AvailabilityDialog
                                schedule={schedule}
                                setOpenAvailability={setOpenAvailability}
                                days={days}
                                getAvailableDays={getAvailableDays}
                            />
                        </Dialog>

                        {/* Social Media Dialog */}
                        <Dialog
                            open={openSocialMedia}
                            onClose={() => setOpenSocialMedia(false)}
                            fullWidth
                            sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
                            maxWidth={"sm"}
                        >
                            <SocialMedia
                                setOpenSocialMedia={setOpenSocialMedia}
                                socialMediaOptions={socialMediaOptions}
                                selectedPlatforms={selectedPlatforms}
                                setSelectedPlatforms={setSelectedPlatforms}
                                availableOptions={availableOptions}
                                setAvailableOptions={setAvailableOptions}
                            />
                        </Dialog>

                        {/* keywords Dialog */}
                        <Dialog
                            open={openKeywords}
                            onClose={() => setOpenKeywords(false)}
                            fullWidth
                            sx={{ "& .MuiDialog-paper": { borderRadius: "15px" } }}
                            maxWidth={"md"}
                        >
                            <Keywords
                                setOpenKeywords={setOpenKeywords}
                                keywords={keywords}
                                setKeywords={setKeywords}
                                removeKeyword={removeKeyword}
                            />
                        </Dialog>

                        {/* Delete merchant profile */}
                        <Dialog
                            open={openDelete}
                            onClose={() => setOpenDelete(false)}
                            fullWidth
                            sx={{ "& .MuiDialog-paper": { borderRadius: "35px" } }}
                            maxWidth={"xs"}
                        >
                            <DeleteMerchant
                                deleteLoading={deleteLoading}
                                setOpenDelete={setOpenDelete}
                                onDeleteMerchant={onDeleteMerchant}
                            />
                        </Dialog>

                        {/* QR code dialog */}
                        <Dialog
                            open={openqr.state}
                            onClose={() => setOpenqr({ state: false })}
                            fullWidth
                            sx={{
                                "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                        width: "100%",
                                        borderRadius: "20px",
                                        maxWidth: "220px",
                                    },
                                },
                            }}
                        >
                            <QrCodeDialog openqr={openqr} setOpenqr={setOpenqr} />
                        </Dialog>

                        {/* Get Location */}
                        <Dialog
                            open={openMap}
                            onClose={() => setOpenMap(false)}
                            fullWidth
                            maxWidth="md"
                            sx={{
                                "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                        width: "100%",
                                        borderRadius: "20px",
                                    },
                                },
                            }}
                        >
                            <GetLocationDialog
                                setOpenMap={setOpenMap}
                                lng={lng}
                                setLng={setLng}
                                lat={lat}
                                setLat={setLat}
                            />
                        </Dialog>

                        {/* store phone number already used dialog */}
                        <Dialog
                            open={numberUsedDialog}
                            onClose={() => setNumberUsedDialog(false)}
                            fullWidth
                            maxWidth="xs"
                            sx={{
                                "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                        width: "100%",
                                        borderRadius: "20px",
                                    },
                                },
                            }}
                        >
                            <DialogContent>
                                <Typography variant='h6' color={"#FA3E3E"} textAlign={"center"} fontWeight={600}>{formatMessage({ id: "merchants.create.warning" })}</Typography>
                                <Typography color={"var(--coolor-dark-blue)"} textAlign={"center"}>{formatMessage({ id: "merchants.create.usednumbermsg" })}</Typography>

                                <DialogActions sx={{ marginTop: "1rem" }}>
                                    <Button
                                        onClick={() => setNumberUsedDialog(false)}
                                        id="cancel"
                                        disableElevation
                                        disableRipple
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            color: "var(--color-dark-blue)",
                                            backgroundColor: "var(--color-cyan) !important",
                                            borderRadius: "20px",
                                            textTransform: "capitalize",
                                            fontWeight: "600",
                                            border: "0 !important"
                                        }}
                                    >
                                        {formatMessage({ id: "edoc.cancel" })}
                                    </Button>
                                    <Button
                                        onClick={() => { id ? creatMerchantApiEdit() : creatMerchantApiAdd() }}
                                        id="upload"
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            color: "#fff",
                                            backgroundColor: "var(--color-dark-blue) !important",
                                            borderRadius: "20px",
                                            textTransform: "capitalize",
                                            fontWeight: "600",
                                            border: "0 !important"
                                        }}
                                    >{loading ?
                                        <CircularProgress
                                            size={25}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "#fff"
                                            }}
                                        /> : formatMessage({ id: "merchants.create.proceed" })
                                        }
                                    </Button>
                                </DialogActions>
                            </DialogContent>
                        </Dialog>
                    </>
            }
        </Box >
    )
}

export default CreateMerchantForm
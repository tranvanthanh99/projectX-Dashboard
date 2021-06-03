import React, { useState, useEffect } from 'react'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ButtonBase from '@material-ui/core/ButtonBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody'
import CardHeader from 'components/Card/CardHeader'
import CardFooter from "components/Card/CardFooter.js";
import GridContainer from 'components/Grid/GridContainer'
import GridItem from 'components/Grid/GridItem'
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomSelect from 'components/CustomSelect/CustomSelect';
import Button from "components/CustomButtons/Button.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import { getProductData, updateProductData, createProduct } from "../../action/product"
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import CustomSwitch from 'components/CustomSwitch/CustomSwitch';
import CustomTagsInput from 'components/CustomTagsInput/CustomTagsInput';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  image: {
    width: "100%",
    height: 100,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
};

const brandList = [
  {
    name: "adidas",
    value: "adidas",
  },
  {
    name: "jordan",
    value: "Jordan",
  },
  {
    name: "nike",
    value: "Nike",
  },
]

const genderList = [
  {
    name: "men",
    value: "men",
  },
  {
    name: "women",
    value: "women",
  },
  {
    name: "child",
    value: "child",
  },
  {
    name: "preschool",
    value: "preschool",
  },
  {
    name: "infant",
    value: "infant",
  },
  {
    name: "toddler",
    value: "toddler",
  },
]

const catagoryList = [
  {
    name: "sneakers",
    value: "sneakers"
  },
]

const imgURL = "https://stockx-assets.imgix.net/media/Product-Placeholder-Default-20210415.jpg?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0";

const useStyles = makeStyles(styles);

function Product(props) {
  const { match } = props;
  const [productData, setProductData] = useState({});
  const [isUpdated, setIsUpdated] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false)
  const [isDangerAlert, setIsDangerAlert] = useState(false)
  const [errorMassage, setErrorMassage] = useState("")
  const [invalidInput, setInvalidInput] = useState([])
  const classes = useStyles();
  // console.log(productData)

  const checkRoute = () => {
    if (match.path === "/admin/product/:id") return true;
    return false;
  }

  useEffect(() => {
    if (checkRoute()) {
      async function fetchProduct() {
        const res = await getProductData(match.params.id);
        if (res.success) setProductData(res.product);
      }
      fetchProduct();
    } else {
      setProductData({
        available: true,
        brand: "",
        description: "",
        gender: "",
        imageurl: imgURL,
        price: "",
        productCategory: "",
        productName: "",
        releaseDate: "",
        sizeQuantity: [],
        tags: [],
        tickerSymbol: "",
        numberSold: 0,
      })
    }
  }, [match.params.id])

  const handleDeleteTag = (i) => {
    setIsUpdated(true);
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag, index) => index !== i)
    })
  }

  const handleDeleteSize = (i) => {
    setIsUpdated(true);
    setProductData({
      ...productData,
      sizeQuantity: productData.sizeQuantity.filter((size, index) => index !== i)
    })
  }

  const handleAddTag = (tag) => {
    setIsUpdated(true);
    setProductData({
      ...productData,
      tags: [...productData.tags, tag]
    })
  }

  const handleAddSize = (size) => {
    setIsUpdated(true);
    const isExisted = productData.sizeQuantity.some((e) => parseFloat(e.size) === parseFloat(size))
    const newSize = isExisted ? productData.sizeQuantity : [...productData.sizeQuantity, { size: size, quantity: "" }]
    setProductData({
      ...productData,
      sizeQuantity: newSize.sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
    })
  }

  const handleEditSize = (e, i) => {
    setIsUpdated(true);
    setProductData({
      ...productData,
      sizeQuantity: productData.sizeQuantity.map((size, index) => index === i ? { ...size, quantity: parseInt(e.target.value) < 0 ? 0 : parseInt(e.target.value) } : size)
    })
  }

  const handleChangeAvailable = (e) => {
    setIsUpdated(true);
    setProductData({
      ...productData,
      available: e.target.checked
    })
  }

  const onInputChange = (e) => {
    setIsUpdated(true);
    setProductData({
      ...productData,
      [e.target.id]: e.target.type === "number" ? parseInt(e.target.value) : e.target.value
    })
  }

  const getInvalidInput = () => {
    const inValidInput = [];
    for (let key in productData) {
      if (key === 'tags') {
        if (productData[key].length === 0) inValidInput.push(key);
      } else if (key === 'sizeQuantity') {
        if (productData[key].length === 0 || productData[key].some(e => e.quantity === "")) inValidInput.push(key);
      } else {
        if (productData[key] === "") inValidInput.push(key);
      }
    }
    return inValidInput;
  }

  const onSubmitChange = async () => {
    const { _id, detail, ...updateOps } = productData;
    setIsUpdated(false);
    setInvalidInput(getInvalidInput());
    detail.map(e => {
      if (e.name === "Retail Price") e.value = productData.price;
      if (e.name === "Release Date") e.value = productData.releaseDate;
    });
    if (getInvalidInput().length === 0) {
      const res = await updateProductData(_id, { detail, ...updateOps });
      if (res.success) {
        setIsSuccessAlert(true);
        setTimeout(() => {
          setIsSuccessAlert(false);
        }, 2000)
      } else {
        setErrorMassage(res.error.response.data.err);
        setIsDangerAlert(true);
        setTimeout(() => {
          setIsDangerAlert(false);
        }, 5000)
      }
    } else {
      setIsDangerAlert(true);
      setTimeout(() => {
        setIsDangerAlert(false);
      }, 5000);
    }
  }

  const onSubmitNewProduct = async () => {
    setIsUpdated(false);
    setInvalidInput(getInvalidInput());
    const detail = {
      "Retail Price": productData.price,
      "Release Date": productData.releaseDate,
    }
    const urlKey = productData.productName.split(" ").join("-")
    if (getInvalidInput().length === 0) {
      const res = await createProduct({ ...productData, detail, urlKey });
      if (res.success) {
        setProductData({
          available: true,
          brand: "",
          description: "",
          gender: "",
          imageurl: imgURL,
          price: "",
          productCategory: "",
          productName: "",
          releaseDate: "",
          sizeQuantity: [],
          tags: [],
          tickerSymbol: "",
          numberSold: 0,
        })
        setIsSuccessAlert(true);
        setTimeout(() => {
          setIsSuccessAlert(false);
        }, 3000)
      } else {
        setErrorMassage(res.error.response.data.err);
        setIsDangerAlert(true);
        setTimeout(() => {
          setIsDangerAlert(false);
        }, 5000);
      }
    } else {
      setIsDangerAlert(true);
      setTimeout(() => {
        setIsDangerAlert(false);
      }, 5000);
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose">
            <h4 className={classes.cardTitleWhite}>Product</h4>
            <p className={classes.cardCategoryWhite}>
              Edit your product here
            </p>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={3} md={3} style={{ textAlign: "center" }}>
                <ButtonBase className={classes.image}>
                  <img className={classes.img} alt="complex" src={productData.imageurl} />
                </ButtonBase>
              </GridItem>
              <GridItem xs={12} sm={6} md={6}>
                <CustomInput
                  labelText="Product Name"
                  id="productName"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: productData.productName != null ? productData.productName : "",
                    type: "text",
                    onChange: onInputChange
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={3} md={3}>
                <CustomInput
                  labelText="Ticker Symbol"
                  id="tickerSymbol"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: productData.tickerSymbol != null ? productData.tickerSymbol : "",
                    type: "text",
                    onChange: onInputChange
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={3} md={3}>
                <CustomSelect
                  labelText="Brand"
                  id="brand"
                  formControlProps={{
                    fullWidth: true
                  }}
                  onChange={onInputChange}
                  inputProps={{
                    value: productData.brand != null ? productData.brand : "",
                  }}
                  itemlist={brandList}
                />
              </GridItem>
              <GridItem xs={12} sm={3} md={3}>
                <CustomSelect
                  labelText="Category"
                  id="productCategory"
                  formControlProps={{
                    fullWidth: true
                  }}
                  onChange={onInputChange}
                  inputProps={{
                    value: productData.productCategory != null ? productData.productCategory : "",
                  }}
                  itemlist={catagoryList}
                />
              </GridItem>
              <GridItem xs={12} sm={2} md={2}>
                <CustomSelect
                  labelText="Gender Types"
                  id="gender"
                  formControlProps={{
                    fullWidth: true
                  }}
                  onChange={onInputChange}
                  inputProps={{
                    value: productData.gender != null ? productData.gender : "",
                  }}
                  itemlist={genderList}
                />
              </GridItem>
              <GridItem xs={12} sm={2} md={2}>
                <CustomInput
                  labelText="Price"
                  id="price"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: productData.price != null ? productData.price : "",
                    type: "number",
                    startAdornment: (<InputAdornment position="start" > $</InputAdornment>),
                    onChange: onInputChange
                  }}
                />
              </GridItem>
              {
                checkRoute() &&
                <GridItem xs={12} sm={2} md={2}>
                  <CustomInput
                    labelText="Number Sold"
                    id="numberSold"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: productData.numberSold != null ? productData.numberSold : "",
                      type: "text",
                      disabled: true,
                    }}
                  />
                </GridItem>
              }
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomTagsInput
                  labelHeading="Tags"
                  tags={productData.tags != null ? productData.tags : []}
                  formControlProps={{}}
                  handleDelete={handleDeleteTag}
                  handleAddition={handleAddTag}
                  inputProps={{
                    placeholder: "press enter to add tag"
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomTagsInput
                  labelHeading="Sizes"
                  isInputList
                  tags={productData.sizeQuantity != null ? productData.sizeQuantity : []}
                  formControlProps={{}}
                  handleDelete={handleDeleteSize}
                  handleAddition={handleAddSize}
                  handleEdit={handleEditSize}
                  inputProps={{
                    placeholder: "press enter to add size",
                    type: "number"
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Description"
                  id="description"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    value: productData.description != null ? productData.description.split("<br>\n").join("") : "",
                    multiline: true,
                    rows: 5,
                    onChange: onInputChange
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={4} md={3}>
                <CustomDatePicker
                  key={productData.releaseDate != null ? "releaseDate" : "releaseDate-null"}
                  labelText="Release Date"
                  id="releaseDate"
                  dateProps={{
                    defaultValue: productData.releaseDate != null ? productData.releaseDate : "",
                    onChange: onInputChange
                  }}
                />
              </GridItem>
              {
                checkRoute() &&
                <GridItem xs={12} sm={4} md={3}>
                  <CustomDatePicker
                    key={productData.dateUpdated != null ? "dateUpdated" : "dateUpdated-null"}
                    labelText="Updated Date"
                    id="dateUpdated"
                    dateProps={{
                      defaultValue: productData.dateUpdated != null ? productData.dateUpdated : "",
                      disabled: true,
                    }}
                  />
                </GridItem>
              }
              <GridItem xs={12} sm={4} md={3}>
                <CustomSwitch
                  label="available"
                  labelPlacement="start"
                  color="success"
                  checked={productData.available != null ? productData.available : false}
                  onChange={handleChangeAvailable}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            {
              checkRoute()
                ?
                <Button disabled={!isUpdated} onClick={onSubmitChange} color="rose">Update Product</Button>
                :
                <Button disabled={!isUpdated} onClick={onSubmitNewProduct} color="rose">Add Product</Button>
            }
            <Snackbar
              place="tc"
              color="success"
              icon={AddAlert}
              message={checkRoute() ? "Product updated successfully" : "Product has been added to database"}
              open={isSuccessAlert}
              closeNotification={() => setIsSuccessAlert(false)}
              close
            />
            <Snackbar
              place="tc"
              color="danger"
              icon={AddAlert}
              message={checkRoute() ? `Can't update Product${invalidInput.length > 0 && ", Invalid input: " + invalidInput.join(", ")}` : (invalidInput.length > 0 ? `Invalid input: ${invalidInput.join(", ")}` : errorMassage)}
              open={isDangerAlert}
              closeNotification={() => setIsDangerAlert(false)}
              close
            />
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  )
}

export default Product

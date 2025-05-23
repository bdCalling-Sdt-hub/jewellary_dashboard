import { Form, Input, message, Modal, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useUpdateCategoryMutation } from "../redux/api/categoryApi";

export const CategoryEdit = ({
  editModal1,
  setEditModal1,
  selectedCategory,
}) => {

  const id = selectedCategory?.key;
 

  const [fileList, setFileList] = useState([]);
  const [updateCategory ,{ isLoading }] = useUpdateCategoryMutation()

  useEffect(() => {
    if (selectedCategory?.image) {
      setFileList([
        {
          uid: "-1",
          name: "category-image.png",
          status: "done",
          url: selectedCategory.image,
        },
      ]);
    }
  }, [selectedCategory]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setEditModal1(false);
  };

  useEffect(() => {
    if (selectedCategory) {
      form.setFieldsValue({
        categoryName: selectedCategory?.categoryName,
        details: selectedCategory?.details,
      });
    }
  }, [selectedCategory, form]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
  
    formData.append("id", id);
    formData.append("name", values.categoryName);
    formData.append("details", values.details);

    fileList.forEach((file) => {
      formData.append("image", file.originFileObj);
    });
  

   updateCategory(formData)
         .then((response) => {
          
           setEditModal1(false);
   
           if (response) {
             message.success(response?.data?.message);
             form.resetFields();
           }
           setFileList([]);
         
         })
         .catch((error) => {
           message.error(error?.data?.message);
           console.error("Error submitting form:", error);
         });
  
  };

  return (
    <Modal
      centered
      open={editModal1}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <div className="mb-6 mt-4">
        <h2 className="text-center font-bold text-lg mb-11">Edit</h2>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {/* Category Name */}
          <Form.Item
            label="Category Name"
            name="categoryName"
            rules={[{ required: true, message: "Please enter the category" }]}
          >
            <Input className="py-2" placeholder="Enter Category" />
          </Form.Item>

          {/* Details */}
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: "Please enter details" }]}
          >
            <Input.TextArea className="py-2" placeholder="Enter Details" />
          </Form.Item>

          {/* Upload Image */}
   
<Form.Item label="Photos">
  <Upload
    listType="picture-card"
    fileList={fileList}
    onChange={onChange}
    onPreview={onPreview}
    maxCount={1} 
  >
    {fileList.length < 1 && "+ Upload"}
  </Upload>
</Form.Item>


          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 w-full border text-black rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 w-full bg-black text-white rounded-md"
              disabled={isLoading} 
            >
              {isLoading ? (
                <Spin size="small" /> 
              ) : (
                "Update"
              )}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import type { FormInstance } from "antd/es/form";
import "./index.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  percent: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  percent: number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ParamsTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [count, setCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [usedPercent, setUsedPercent] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "名称",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "概率",
      dataIndex: "percent",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: any, index: number) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: `NULL`,
      percent: 0,
    };
    if (usedPercent + newData.percent >= 100) {
      messageApi.error("分配概率超出100%, 请确认后重试");
      return;
    }
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  useEffect(() => {
    setCandidatesCount(dataSource.length);
    let _usedPercent = 0;
    dataSource.forEach((el) => {
      let per = 0;
      if (typeof el.percent === "string") {
        per = parseInt(el.percent);
      } else {
        per = el.percent;
      }
      _usedPercent += per;
    });
    setUsedPercent(_usedPercent);
  }, [dataSource]);

  const handleDel = () => {
    setDataSource([]);
    setCount(0);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      {contextHolder}
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        添加一行
      </Button>
      <Button
        onClick={handleDel}
        danger
        style={{ marginBottom: 16, marginLeft: 16 }}
      >
        删除全部
      </Button>
      <Space className="tags-right">
        <Tag color="#87d068">当前候选数: {candidatesCount}</Tag>
        <Tag color="#108ee9">已分配: {usedPercent}%</Tag>
        <Tag color="#f50">待分配: {100 - usedPercent}%</Tag>
      </Space>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default ParamsTable;

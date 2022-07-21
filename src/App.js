import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Button, Space, Table, Input, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { Search } = Input;

const RandomUser = () => {

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(null)
  const [gender, setGender] = useState('')
  const [search, setSearch] = useState('')

  const loadData = () => {
    setLoading(true)
    const getData = async () => {
      try {
        const response = await fetch(
          `https://randomuser.me/api/?page1&pageSize=10&results=10&keyword=${search}&gender=${gender}`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData?.results);
        setLoading(false)
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    getData()
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (search || gender) {
      loadData()
    }
  }, [search, gender])

  const onSearch = (value) => {
    setSearch(value)
    loadData()
  };

  const handleMenuClick = (e) => {
    if (e.key == 1) {
      setGender('male')
    }
    if (e.key == 2) {
      setGender('female')
    }
    loadData()
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: 'Male',
          key: '1',
        },
        {
          label: 'Female',
          key: '2',
        }
      ]}
    />
  );

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const resetFilter = () => {
    setGender('')
    setSearch('')
    loadData()
  }

  const columns = [
    {
      title: 'Username',
      dataIndex: ['login', 'username'],
      key: 'username',
      sorter: (a, b) => a.login.username.localeCompare(b.login.username),
      sortOrder: sortedInfo.columnKey === 'username' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Name',
      dataIndex: ['name', 'first'],
      key: 'name',
      sorter: (a, b) => a.name.first.localeCompare(b.name.first),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === 'email' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: (a, b) => a.gender.localeCompare(b.gender.length),
      sortOrder: sortedInfo.columnKey === 'gender' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Registered Date',
      dataIndex: ['registered', 'date'],
      key: 'registered',
      sorter: (a, b) => b.registered.date.localeCompare(a.registered.date),
      sortOrder: sortedInfo.columnKey === 'registered.date' ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];
  return (
    <div style={{ padding: 20 }}>
      <Space
        style={{
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'end'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p>Search</p>
          <Search placeholder="input search text" onSearch={onSearch} enterButton />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p>Gender</p>
          <Dropdown overlay={menu}>
            <Button>
              <Space>
                {gender ? gender : 'All'}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <Button onClick={resetFilter}>Reset Filter</Button>
      </Space>
      <Table loading={loading} columns={columns} dataSource={data} onChange={handleChange} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default RandomUser;
import { Button, FloatingLabel, Label, Modal, Select, Table } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { URL } from '../../../environments/global';
import Swal from 'sweetalert2';

export const ManagePersonal = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState();
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department_id: '',
    position_id: '',
    role_id: '',
  });

  // Traer los responsables
  const fetchData = async () => {
    try {
      const response = await fetch(`${URL}/getAllUsers`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // FindOne user
  const fetchFindOne = async (id) => {
    try {
      // console.log(`${URL}/findOneUser/${id}`)
      const response = await fetch(`${URL}/findOneUser/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      // setData(result.user);
      console.log(result.user[0]);
      const object = result.user[0];
      setId(object.id);
      setIsEditing(true);
      openModalHandler();
      setFormData({
        name: object.name,
        email: object.email,
        department_id: object.department_id,
        position_id: object.position_id,
        role_id: object.role_id,
      })
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Traer los roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${URL}/getRoles`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Roles:', result.roles);
      setRoles(result.roles);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Traer los roles
  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${URL}/getDepartments`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Departamentos:', result.departments);
      setDepartments(result.departments);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      // Mostrar alerta de confirmación
      const confirmResult = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este usuario?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      });

      // Si el usuario confirma, proceder con la eliminación
      if (confirmResult.isConfirmed) {
        const response = await fetch(`${URL}/deleteUser/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const result = await response.json();
        console.log("Response: ", result);

        // Mostrar alerta de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error: ", error.message);

      // Mostrar alerta de error
      Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al eliminar el usuario.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // Traer los roles
  const fetchPositions = async () => {
    try {
      const response = await fetch(`${URL}/getPositions`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Positions:', result.positions);
      setPositions(result.positions);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openModalHandler = () => {
    setOpenModal(true);
    fetchDepartments();
    fetchRoles();
    fetchPositions();
  }

  useEffect(() => {


    fetchData();

  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    try {
      if (isEditing) {
        const response = await fetch(`${URL}/updateUser/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('User updated successfully:', result);

        // setFormData({
        //   user_name: '',
        //   email: '',
        //   department_id: '',
        //   position_id: '',
        //   role_id: '',
        // });

        setOpenModal(false);

        fetchData();
      } else {
        const response = await fetch(`${URL}/saveUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('User created successfully:', result);

        setFormData({
          user_name: '',
          email: '',
          department_id: '',
          position_id: '',
          role_id: '',
        });

        setOpenModal(false);

        fetchData();
      }

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      <Button onClick={() => {
        openModalHandler();
      }}>Agregar Responsable</Button>
      <Table hoverable className="mt-10">
        <Table.Head>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Departamento</Table.HeadCell>
          <Table.HeadCell>Cargo</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((user, index) => (
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.user_name}
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.department_name}</Table.Cell>
              <Table.Cell>{user.position_name}</Table.Cell>
              <Table.Cell className='flex gap-x-4'>
                <Button color='yellow' onClick={() => {
                  fetchFindOne(user.user_id);
                }}>Editar</Button>
                <Button color='red' onClick={() => {
                  deleteUser(user.user_id);
                }}>Eliminar</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Modal para agregar actividad */}
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>{isEditing ? 'Editar persona' : 'Agregar persona'}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <FloatingLabel
              variant="outlined"
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <FloatingLabel
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="mt-2">
              {/* <div className="mb-2 block">
                <Label htmlFor="countries" value="Responsable de la actividad" />
              </div> */}
              <Select
                id="roles"
                name="role_id"
                value={formData.role_id || ''}
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <option value="" disabled>Seleccione un rol</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </Select>
            </div>
            <div className="mt-2">
              {/* <div className="mb-2 block">
                <Label htmlFor="countries" value="Responsable de la actividad" />
              </div> */}
              <Select
                id="departments"
                name="department_id"
                value={formData.department_id || ''}
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <option value="" disabled>Seleccione un departamento</option>
                {departments?.map((department) => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </Select>
            </div>
            <div className="mt-2">
              {/* <div className="mb-2 block">
                <Label htmlFor="countries" value="Responsable de la actividad" />
              </div> */}
              <Select
                id="positions"
                name="position_id"
                value={formData.position_id || ''}
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <option value="" disabled>Seleccione un cargo</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>{position.title}</option>
                ))}
              </Select>
            </div>


            <Button type="submit" className="mt-5">
              {isEditing ? 'Editar' : 'Registrar'}
            </Button>
          </form>
        </Modal.Body>
      </Modal >
    </>
  );
};

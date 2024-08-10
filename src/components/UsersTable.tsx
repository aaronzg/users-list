
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Button,
  TextInput,
} from '@tremor/react';

import { useAppDispatch, useAppSelector } from '../store/hooks/storeHooks';
import { deleteUserById, resetState, setUsersState } from '../store/users/usersSlice';
import { useEffect, useState } from 'react';
import { exampleUsers } from '../mock/mock';
type prop = 'country' | 'name' | 'last' | ''

export function UsersTable () {
  const [actions, setActions] = useState({
    colorCells: false,
    sortedBy: '' as prop
  })
  const [value, setValue] = useState('')
  const sortBy = {
    country: (arr: typeof users) => {
      return arr.sort((a,b) => a.country.localeCompare(b.country))
    },
    name: (arr: typeof users) => {
      return arr.sort((a,b) => a.name.localeCompare(b.name))
    },
    last: (arr: typeof users) => {
      return arr.sort((a,b) => a.lastName.localeCompare(b.lastName))
    } 
  }

  const users = useAppSelector((state) => state.users)
  const usersList = actions.sortedBy ? sortBy[actions.sortedBy](structuredClone(users)) : users
  

  const filteredUsers = (arr: typeof users, query: string) => {
    return arr.filter((user) => {
      if(user.country.toLowerCase().search(query) !== -1) return true
    })
  }


  const dispatch = useAppDispatch()

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
    .then(res => res.json())
    .then((data) => {
      const usersArray = data.results?.map((user: typeof exampleUsers[0], index: number) => {
        return {
          name: user.name.first,
        lastName: user.name.last ,
        picture: user.picture.thumbnail,
        country: user.location.country,
        id: index
        }
      })

      dispatch(setUsersState(usersArray))
    })
  },[])

  const handleClick = () => { 
    setActions({...actions, sortedBy: actions.sortedBy === 'country' ? '' : 'country'})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }


  return (

    <Card>
        <h3 className="text-center text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold text-xl">List of Swiss Federal Councillours</h3>
      <div className='flex gap-4'>
        <Button onClick={handleClick}>{actions.sortedBy === 'country' ? 'Unsort by countries' : 'Sort by countries'}</Button>

        <Button onClick={() => {

          setActions({...actions, colorCells: !actions.colorCells})
        }}>{actions.colorCells ? 'No colors' : 'Cells with colors'}</Button>

        <Button onClick={() => {
          dispatch(resetState())
          }}>Reset state</Button>

        <TextInput
        placeholder='Filter by country'
        onChange={handleChange}
        value={value}/>
      </div>

      <Table className="mt-5">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Picture</TableHeaderCell>
            <TableHeaderCell className='cursor-pointer' onClick={() => setActions({...actions, sortedBy: actions.sortedBy === 'name' ? '' : 'name'})} >First Name</TableHeaderCell>
            <TableHeaderCell className='cursor-pointer' onClick={() => setActions({...actions, sortedBy: actions.sortedBy === 'last' ? '' : 'last'})}>Last Name</TableHeaderCell>
            <TableHeaderCell className='cursor-pointer' onClick={() => setActions({...actions, sortedBy: actions.sortedBy === 'country' ? '' : 'country'})}>Country</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers(usersList, value).map((user,index) => { 
            const id = index + 1
            const isOdd = id % 2 === 0
            const coloredClass = isOdd ? 'bg-slate-700' : 'bg-slate-800'
            
            return(
            <TableRow key={user.id} className={actions.colorCells ? coloredClass : ''}>
              <TableCell>
                <img src={user.picture} alt={user.name} className='rounded-full' />
              </TableCell>
              <TableCell>
                {user.name}
              </TableCell>
              <TableCell>
                {user.lastName}
              </TableCell>
              <TableCell>
                {user.country}
              </TableCell>
              <TableCell>
                <Button onClick={() => {
                  dispatch(deleteUserById(user.id))
                }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </Card>
  );
}
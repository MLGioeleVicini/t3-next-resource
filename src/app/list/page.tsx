import { api } from "@/trpc/server"

const ListPage = async () => {
  const resources= await api.resource.getAll();

  return (
    <>
<div>ListPage</div>

<table>
  <tbody>
    <tr>
      <th>Items</th>
      <th>Items</th>
      <th>Items</th>
      <th>Items</th>
      <th>Items</th>
      <th>Items</th>
    </tr>
    { resources.map( resource => (

      <tr key={resource.id_resources}>
        <td>{resource.id_resources}</td>
        <td>{resource.resource_extension}</td>
        <td>{resource.id_localization}</td>
        <td>{resource.page_keys}</td>
        <td>{resource.resource_key}</td>
        <td>{resource.resource_value}</td>
      </tr>
      )
    ) }
  </tbody>
</table>

    </>
  )
} 

export default ListPage
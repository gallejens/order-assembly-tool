import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { Button, Group, Loader, Table, TextInput } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { type FC, useState } from 'react';
import styles from '../styles/itemproducts.module.scss';

type Props = {
  itemId: number;
  itemLabel: string;
};

export const ItemProducts: FC<Props> = props => {
  const { data: itemKeys } = useDatabase('getItemKeysByItemId', [props.itemId]);
  const { data: productIds, refresh: refreshProductIds } = useDatabase(
    'getProductIdsForItem',
    [props.itemId]
  );
  const { data: productValues, refresh: refreshProductValues } = useDatabase(
    'getProductValuesForItem',
    [props.itemId]
  );

  const [dataFieldInput, setDataFieldInput] = useState('');
  const [selectedDataField, setSelectedDataField] = useState<{
    productId: number;
    keyId: number;
  } | null>(null);

  const refresh = () => {
    refreshProductIds();
    refreshProductValues();
  };

  const handleAddProduct = async () => {
    await db.execute('INSERT INTO products (itemId) VALUES ($1);', [
      props.itemId,
    ]);
    refresh();
  };

  const handleEditProductValue = (productId: number, keyId: number) => {
    setSelectedDataField({ productId, keyId });
    setDataFieldInput('');
  };

  const handleRemoveProduct = async (productId: number) => {
    console.log(`Removing product ${productId}`);
    await db.execute('DELETE FROM products WHERE id = $1;', [productId]);
    refresh();
  };

  const products: { id: number; values: { keyId: number; value: string }[] }[] =
    [];
  if (productIds !== null && productValues !== null && itemKeys !== null) {
    for (const { id } of productIds) {
      const values = productValues.filter(v => v.productId === id);
      products.push({
        id,
        values: itemKeys.map(itemKey => ({
          keyId: itemKey.id,
          value: values.find(v => v.keyId === itemKey.id)?.value ?? '/',
        })),
      });
    }
  }

  console.log(products);

  return (
    <div className={styles.item_products}>
      {itemKeys === null ? (
        <Loader />
      ) : (
        <Table.ScrollContainer minWidth='100%'>
          <Table
            striped
            withRowBorders={false}
            withColumnBorders
            withTableBorder
          >
            <Table.Thead>
              <Table.Tr>
                {itemKeys?.map(k => (
                  <Table.Th>{k.name}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.map(product => {
                return (
                  <Table.Tr key={`table_row_${product.id}`}>
                    {product.values.map(v => (
                      <Table.Td
                        key={`table_row_data_${v.keyId}`}
                        onClick={() => {
                          handleEditProductValue(product.id, v.keyId);
                        }}
                      >
                        {selectedDataField?.productId === product.id &&
                        selectedDataField?.keyId === v.keyId ? (
                          <TextInput
                            value={dataFieldInput}
                            onChange={e =>
                              setDataFieldInput(e.currentTarget.value)
                            }
                            rightSection={
                              <Group>
                                <IconX />
                                <IconCheck />
                              </Group>
                            }
                          />
                        ) : (
                          v.value
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
      <Button onClick={handleAddProduct}>Add New Product</Button>
    </div>
  );
};

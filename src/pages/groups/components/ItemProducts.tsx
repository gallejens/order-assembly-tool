import { ConfirmModal } from '@/components/modals';
import { useDatabase } from '@/hooks/useDatabase';
import { db } from '@/lib/db';
import { useMainStore } from '@/stores/useMainStore';
import { Button, Checkbox, Loader, Table, TextInput } from '@mantine/core';
import { type FC, useRef, useState } from 'react';
import styles from '../styles/itemproducts.module.scss';

type Props = {
  itemId: number;
  itemLabel: string;
};

export const ItemProducts: FC<Props> = props => {
  const { openModal, closeModal } = useMainStore(s => ({
    openModal: s.openModal,
    closeModal: s.closeModal,
  }));

  const { data: itemKeys } = useDatabase('getItemKeysByItemId', [props.itemId]);
  const { data: productIds, refresh: refreshProductIds } = useDatabase(
    'getProductIdsForItem',
    [props.itemId]
  );
  const { data: productValues, refresh: refreshProductValues } = useDatabase(
    'getProductValuesForItem',
    [props.itemId]
  );

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    productId: number;
    keyId: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const handleRemoveSelectedRows = async () => {
    openModal(
      <ConfirmModal
        title='Are you sure you want to delete the selected products?'
        onConfirm={async () => {
          await db.execute(
            `DELETE FROM products WHERE id IN (${selectedRows
              .map((_, i) => `$${i + 1}`)
              .join(', ')});`,
            selectedRows
          );
          refresh();
          closeModal();
          setSelectedRows([]);
        }}
      />
    );
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
          value: values.find(v => v.keyId === itemKey.id)?.value ?? '',
        })),
      });
    }
  }

  const selectNextValue = (productId: number, keyId: number) => {
    const product = products.find(p => p.id === productId);
    if (product === undefined) {
      setSelectedCell(null);
      return;
    }

    const currentIdx = product.values.findIndex(v => v.keyId === keyId);
    const newKeyId = product.values[currentIdx + 1]?.keyId;
    if (newKeyId === undefined) {
      // TODO: Go to next product
      setSelectedCell(null);
      return;
    }

    setSelectedCell({
      productId: productId,
      keyId: newKeyId,
    });
  };

  const handleInputRefChange = (
    ref: HTMLInputElement | null,
    productId: number,
    keyId: number,
    initialValue: string
  ) => {
    inputRef.current = ref;
    if (inputRef.current === null) return;

    inputRef.current.focus();
    inputRef.current.value = initialValue;

    inputRef.current.addEventListener('keydown', async e => {
      switch (e.key) {
        case 'Escape': {
          setSelectedCell(null);
          break;
        }
        case 'Enter': {
          const newName = inputRef.current?.value ?? '';
          await db.execute(
            'INSERT OR REPLACE INTO product_values (productId, keyId, value) VALUES ($1, $2, $3);',
            [productId, keyId, newName]
          );
          refresh();
          selectNextValue(productId, keyId);
          break;
        }
        case 'Tab': {
          e.preventDefault();
          selectNextValue(productId, keyId);
          break;
        }
      }
    });
  };

  return (
    <div className={styles.item_products}>
      {itemKeys === null ? (
        <Loader />
      ) : (
        <div className={styles.table}>
          <Table striped withRowBorders={false} withColumnBorders stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th /> {/* Empty column for select button */}
                {itemKeys?.map(k => (
                  <Table.Th>{k.name}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {products.map(product => {
                const selected = selectedRows.includes(product.id);
                return (
                  <Table.Tr
                    key={`table_row_${product.id}`}
                    className={styles.table_row}
                    bg={selected ? 'var(--mantine-color-primary-9)' : undefined}
                  >
                    <Table.Td>
                      <Checkbox
                        checked={selected}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, product.id]);
                          } else {
                            setSelectedRows(
                              selectedRows.filter(id => id !== product.id)
                            );
                          }
                        }}
                      />
                    </Table.Td>
                    {product.values.map(v => (
                      <Table.Td
                        key={`table_row_data_${v.keyId}`}
                        onClick={() => {
                          setSelectedCell({
                            productId: product.id,
                            keyId: v.keyId,
                          });
                        }}
                      >
                        {selectedCell?.productId === product.id &&
                        selectedCell?.keyId === v.keyId ? (
                          <TextInput
                            ref={ref => {
                              handleInputRefChange(
                                ref,
                                selectedCell.productId,
                                selectedCell.keyId,
                                v.value
                              );
                            }}
                            placeholder={v.value}
                            variant='unstyled'
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
        </div>
      )}
      <div className={styles.footer}>
        {selectedRows.length > 0 && (
          <Button onClick={handleRemoveSelectedRows} color='red'>
            Delete
          </Button>
        )}
        <Button onClick={handleAddProduct}>Add New Product</Button>
      </div>
    </div>
  );
};

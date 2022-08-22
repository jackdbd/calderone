/**
 * Complete list of **non-deprecated** SQLite PRAGMA statements.
 *
 * @see [PRAGMA Statements - sqlite.org](https://www.sqlite.org/pragma.html)
 *
 * @public
 */
export const PRAGMAS = [
  'analysis_limit',
  'application_id',
  'auto_vacuum',
  'automatic_index',

  'busy_timeout',

  'cache_size',
  'cache_spill',
  'case_sensitive_like',
  'cell_size_check',
  'checkpoint_fullfsync',
  'collation_list',
  'compile_options',

  'data_version',
  'database_list',
  'defer_foreign_keys',

  'encoding',

  'foreign_key_check',
  'foreign_key_list',
  'foreign_keys',
  'freelist_count',
  'fullfsync',
  'function_list',

  'hard_heap_limit',

  'ignore_check_constraints',
  'incremental_vacuum',
  'index_info',
  'index_list',
  'index_xinfo',
  'integrity_check',

  'journal_mode',
  'journal_size_limit',

  'legacy_alter_table',
  'legacy_file_format',
  'locking_mode',

  'max_page_count',
  'mmap_size',
  'module_list',

  'optimize',

  'page_count',
  'page_size',
  'parser_trace',
  'pragma_list',

  'query_only',
  'quick_check',

  'read_uncommitted',
  'recursive_triggers',
  'reverse_unordered_selects',

  'schema_version',
  'secure_delete',
  'shrink_memory',
  'soft_heap_limit',
  'stats',
  'synchronous',

  'table_info',
  'table_list',
  'table_xinfo',
  'temp_store',
  'threads',
  'trusted_schema',

  'user_version',

  'vdbe_addoptrace',
  'vdbe_debug',
  'vdbe_listing',
  'vdbe_trace',

  'wal_autocheckpoint',
  'wal_checkpoint',
  'writable_schema'
]

/**
 * Complete list of **deprecated** SQLite PRAGMA statements.
 *
 * @see [PRAGMA Statements - sqlite.org](https://www.sqlite.org/pragma.html)
 *
 * @public
 */
export const DEPRECATED_PRAGMAS = [
  'count_changes',
  'data_store_directory',
  'default_cache_size',
  'empty_result_callbacks',
  'full_column_names',
  'short_column_names',
  'temp_store_directory'
]
